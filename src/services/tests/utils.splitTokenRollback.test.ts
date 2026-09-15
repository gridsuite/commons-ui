/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { beforeEach, expect, jest, test } from '@jest/globals';
import type { SplitTokenConfig } from '../appsMetadata';
import { ACCESS_TOKEN_SHARE_QUERY_PARAM } from '../utils';
import type { CustomUser } from '../../features/authentication/utils/authService';

// Tests for the split-token rollback block in ../utils.ts (this whole file would go together
// with it, if we ever remove that block). splitTokenDisabled/splitTokenConfigLoadStarted are
// module-level state private to ../utils, triggered as a side effect of the first
// setupAuthenticatedUrl call in a given module instance, so each test below needs its own fresh,
// isolated instance of both ../utils and the mocked ../appsMetadata it fetches the config from -
// jest.isolateModulesAsync + dynamic import gives each test that isolation.

jest.mock('../appsMetadata', (): typeof import('../appsMetadata') => ({
    ...jest.requireActual<typeof import('../appsMetadata')>('../appsMetadata'),
    fetchSplitTokenConfig: jest.fn<() => Promise<SplitTokenConfig>>(),
}));

// jest.mock's factory (and the jest.fn() it returns) is shared across every isolated module
// registry created below, so call counts otherwise accumulate across tests in this file.
beforeEach(() => {
    jest.clearAllMocks();
});

async function flushMicrotasks(): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}

/** Same helper as utils.test.ts's mockLoggedInUser: a CustomUser with id_token and precomputed
 * accessTokenShares, passed directly to setupAuthenticatedUrl. Their exact values don't matter
 * for these rollback tests (only whether setupAuthenticatedUrl reaches the split branch at all),
 * so they're just fixed placeholder strings, not a real XOR pair. */
function mockLoggedInUser(token: string): CustomUser {
    return { id_token: token, accessTokenShares: ['cookie-share', 'query-share'] } as CustomUser;
}

test('keeps splitting the token (config not loaded yet) on the very first call that triggers the fetch', async () => {
    await jest.isolateModulesAsync(async () => {
        const appsMetadata = await import('../appsMetadata');
        // never resolves within this test - simulates the request still being in flight
        jest.mocked(appsMetadata.fetchSplitTokenConfig).mockReturnValue(new Promise(() => {}));
        const { setupAuthenticatedUrl } = await import('../utils');

        const result = setupAuthenticatedUrl(mockLoggedInUser('some-token'), '/api/foo');

        expect(result).not.toContain('access_token=some-token');
        expect(result).toMatch(new RegExp(`[?&]${ACCESS_TOKEN_SHARE_QUERY_PARAM}=[A-Za-z0-9_-]+`));
    });
});

test('falls back to sending the whole token in the query param, once the config resolves with disable:true', async () => {
    await jest.isolateModulesAsync(async () => {
        const appsMetadata = await import('../appsMetadata');
        jest.mocked(appsMetadata.fetchSplitTokenConfig).mockResolvedValue({ disable: true });
        const { setupAuthenticatedUrl } = await import('../utils');
        const user = mockLoggedInUser('some-token');

        setupAuthenticatedUrl(user, '/api/foo'); // first call: triggers the fetch, still split
        await flushMicrotasks(); // let the mocked fetch's promise resolve
        const result = setupAuthenticatedUrl(user, '/api/foo');

        expect(result).toBe('/api/foo?access_token=some-token');
    });
});

test.each([[{ disable: false }], [{}]])(
    'keeps splitting the token when the config resolves with %p',
    async (config) => {
        await jest.isolateModulesAsync(async () => {
            const appsMetadata = await import('../appsMetadata');
            jest.mocked(appsMetadata.fetchSplitTokenConfig).mockResolvedValue(config);
            const { setupAuthenticatedUrl } = await import('../utils');
            const user = mockLoggedInUser('some-token');

            setupAuthenticatedUrl(user, '/api/foo');
            await flushMicrotasks();
            const result = setupAuthenticatedUrl(user, '/api/foo');

            expect(result).not.toContain('access_token=some-token');
            expect(result).toMatch(new RegExp(`[?&]${ACCESS_TOKEN_SHARE_QUERY_PARAM}=[A-Za-z0-9_-]+`));
        });
    }
);

test('keeps splitting the token (fail-safe default) when fetching the config fails', async () => {
    await jest.isolateModulesAsync(async () => {
        const appsMetadata = await import('../appsMetadata');
        jest.mocked(appsMetadata.fetchSplitTokenConfig).mockRejectedValue(new Error('split-token.json: 404'));
        const { setupAuthenticatedUrl } = await import('../utils');
        const user = mockLoggedInUser('some-token');

        setupAuthenticatedUrl(user, '/api/foo');
        await flushMicrotasks();
        const result = setupAuthenticatedUrl(user, '/api/foo');

        expect(result).not.toContain('access_token=some-token');
        expect(result).toMatch(new RegExp(`[?&]${ACCESS_TOKEN_SHARE_QUERY_PARAM}=[A-Za-z0-9_-]+`));
    });
});

test('fetches split-token.json at most once no matter how many times setupAuthenticatedUrl is called', async () => {
    await jest.isolateModulesAsync(async () => {
        const appsMetadata = await import('../appsMetadata');
        jest.mocked(appsMetadata.fetchSplitTokenConfig).mockResolvedValue({ disable: true });
        const { setupAuthenticatedUrl } = await import('../utils');
        const user = mockLoggedInUser('some-token');

        setupAuthenticatedUrl(user, '/api/foo');
        await flushMicrotasks();
        setupAuthenticatedUrl(user, '/api/foo');
        setupAuthenticatedUrl(user, '/api/bar');

        expect(appsMetadata.fetchSplitTokenConfig).toHaveBeenCalledTimes(1);
    });
});
