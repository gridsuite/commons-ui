/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { User } from 'oidc-client-ts';
import { dispatchUser, type CustomUser } from '../authService';
import { isSplitTokenDisabled } from '../../../../services/utils';

// dispatchUser (see ../authService.ts) decodes user.id_token via jwt-decode twice
// (getIdTokenExpiresIn/computeMinExpiresIn) to work out its remaining lifetime - mocked here so a
// plain fake string can stand in for id_token, without needing a real base64-encoded JWT.
jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(() => ({ exp: Date.now() / 1000 + 3600 })), // 1h in the future - never expired
}));

// dispatchUser only needs isSplitTokenDisabled from here (see ../../../../services/utils.ts) -
// mocked directly so each test below can control it synchronously, without going through the
// real (async, fetch-based) rollback config loading it's built on - already covered on its own by
// ../../../../services/tests/utils.splitTokenRollback.test.ts.
jest.mock('../../../../services/utils', (): typeof import('../../../../services/utils') => ({
    ...jest.requireActual<typeof import('../../../../services/utils')>('../../../../services/utils'),
    isSplitTokenDisabled: jest.fn(() => false),
}));

function base64UrlDecode(value: string): Uint8Array {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
    // eslint-disable-next-line no-bitwise -- XOR is the actual algorithm here, not a `||` typo
    return a.map((byte, i) => byte ^ b[i]);
}

function mockUser(overrides: Partial<User> = {}): User {
    return { id_token: 'fake-id-token', expires_in: 300, profile: {}, ...overrides } as User;
}

function mockUserManager(user: User | null): Parameters<typeof dispatchUser>[1] {
    return {
        getUser: jest.fn<() => Promise<User | null>>().mockResolvedValue(user),
        storeUser: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    } as unknown as Parameters<typeof dispatchUser>[1];
}

describe('dispatchUser', () => {
    beforeEach(() => {
        jest.mocked(isSplitTokenDisabled).mockReturnValue(false);
        // getOrCreateAccessTokenShares (see ../authService.ts) persists shares to localStorage so
        // that other tabs of the same origin can reuse them - clear it between tests so they
        // don't leak into one another (jsdom's localStorage is shared across all tests in this
        // file, unlike a fresh module instance per test).
        localStorage.clear();
    });

    test('attaches the two precomputed, XOR-recoverable accessTokenShares to the user dispatched to redux, when the split-token mechanism is enabled', async () => {
        const dispatchMock = jest.fn();

        await dispatchUser(dispatchMock as unknown as Parameters<typeof dispatchUser>[0], mockUserManager(mockUser()));

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        const dispatchedUser = (dispatchMock.mock.calls[0][0] as { user: CustomUser }).user;
        expect(dispatchedUser.accessTokenShares).toHaveLength(2);
        const [cookieShare, queryShare] = dispatchedUser.accessTokenShares!;
        // Neither share alone looks anything like the token...
        expect(cookieShare).not.toContain('fake-id-token');
        expect(queryShare).not.toContain('fake-id-token');
        // ...but XOR-ing them back together recovers it, exactly like the gateway does (see
        // generateAccessTokenShares in ../authService.ts).
        const recovered = new TextDecoder().decode(xor(base64UrlDecode(cookieShare), base64UrlDecode(queryShare)));
        expect(recovered).toBe('fake-id-token');
    });

    test('does not attach accessTokenShares to the user dispatched to redux when the split-token mechanism is disabled via rollback config', async () => {
        jest.mocked(isSplitTokenDisabled).mockReturnValue(true);
        const dispatchMock = jest.fn();

        await dispatchUser(dispatchMock as unknown as Parameters<typeof dispatchUser>[0], mockUserManager(mockUser()));

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        const dispatchedUser = (dispatchMock.mock.calls[0][0] as { user: CustomUser }).user;
        expect(dispatchedUser.accessTokenShares).toBeUndefined();
    });

    test('does not dispatch anything when there is no logged-in user', async () => {
        const dispatchMock = jest.fn();

        await dispatchUser(dispatchMock as unknown as Parameters<typeof dispatchUser>[0], mockUserManager(null));

        expect(dispatchMock).not.toHaveBeenCalled();
    });

    test('reuses the exact same accessTokenShares across independent calls for the same token, simulating two tabs sharing the AccessTokenShare cookie via localStorage', async () => {
        const firstDispatchMock = jest.fn();
        const secondDispatchMock = jest.fn();

        // Each call gets its own dispatch/userManager mocks (as two different tabs would each
        // have their own in-memory JS state), but both resolve the same user/id_token - the only
        // thing genuinely shared between real tabs is localStorage (and the AccessTokenShare
        // cookie itself, which this test doesn't touch).
        await dispatchUser(
            firstDispatchMock as unknown as Parameters<typeof dispatchUser>[0],
            mockUserManager(mockUser())
        );
        await dispatchUser(
            secondDispatchMock as unknown as Parameters<typeof dispatchUser>[0],
            mockUserManager(mockUser())
        );

        const firstShares = (firstDispatchMock.mock.calls[0][0] as { user: CustomUser }).user.accessTokenShares;
        const secondShares = (secondDispatchMock.mock.calls[0][0] as { user: CustomUser }).user.accessTokenShares;
        expect(secondShares).toEqual(firstShares);
    });

    test('generates and persists fresh accessTokenShares when the token changes, e.g. after a renewal', async () => {
        const firstDispatchMock = jest.fn();
        const secondDispatchMock = jest.fn();

        await dispatchUser(
            firstDispatchMock as unknown as Parameters<typeof dispatchUser>[0],
            mockUserManager(mockUser({ id_token: 'fake-id-token' }))
        );
        await dispatchUser(
            secondDispatchMock as unknown as Parameters<typeof dispatchUser>[0],
            mockUserManager(mockUser({ id_token: 'renewed-id-token' }))
        );

        const firstShares = (firstDispatchMock.mock.calls[0][0] as { user: CustomUser }).user.accessTokenShares;
        const secondShares = (secondDispatchMock.mock.calls[0][0] as { user: CustomUser }).user.accessTokenShares;
        expect(secondShares).not.toEqual(firstShares);
        const [cookieShare, queryShare] = secondShares!;
        const recovered = new TextDecoder().decode(xor(base64UrlDecode(cookieShare), base64UrlDecode(queryShare)));
        expect(recovered).toBe('renewed-id-token');
    });

    test('falls back to generating a fresh, unpersisted pair of accessTokenShares when localStorage throws', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('storage unavailable');
        });
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('storage unavailable');
        });
        const dispatchMock = jest.fn();

        await dispatchUser(dispatchMock as unknown as Parameters<typeof dispatchUser>[0], mockUserManager(mockUser()));

        const dispatchedUser = (dispatchMock.mock.calls[0][0] as { user: CustomUser }).user;
        expect(dispatchedUser.accessTokenShares).toHaveLength(2);
        jest.restoreAllMocks();
    });
});
