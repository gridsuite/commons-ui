/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { describe, expect, jest, test } from '@jest/globals';
import { ACCESS_TOKEN_SHARE_COOKIE_NAME, ACCESS_TOKEN_SHARE_QUERY_PARAM, setupAuthenticatedUrl } from '../utils';
import type { CustomUser } from '../../features/authentication/utils/authService';

/**
 * Base64url-encodes (no padding) a byte array: the same wire format
 * generateAccessTokenShares (see ../../features/authentication/utils/authService.ts) produces,
 * and the gateway decodes with Java's `Base64.getUrlDecoder()` (which tolerates missing padding).
 */
function base64UrlEncode(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
    // eslint-disable-next-line no-bitwise -- XOR is the actual algorithm here, not a `||` typo
    return a.map((byte, i) => byte ^ b[i]);
}

/**
 * Builds a CustomUser-like object (see ../../features/authentication/utils/authService.ts) with
 * an id_token and its two precomputed, base64url-encoded XOR shares - the same shape
 * generateAccessTokenShares really attaches before dispatch, so setupAuthenticatedUrl can use
 * them exactly as-is, with no XOR-ing or encoding left to do.
 */
function mockLoggedInUser(token: string, overrides: Partial<CustomUser> = {}): CustomUser {
    const tokenBytes = new TextEncoder().encode(token);
    const random = new Uint8Array(tokenBytes.length);
    crypto.getRandomValues(random);
    return {
        id_token: token,
        accessTokenShares: [base64UrlEncode(random), base64UrlEncode(xor(tokenBytes, random))],
        ...overrides,
    } as CustomUser;
}

function extractCookieShare(setCookieValue: string): string {
    return setCookieValue.slice(`${ACCESS_TOKEN_SHARE_COOKIE_NAME}=`.length, setCookieValue.indexOf(';'));
}

describe('setupAuthenticatedUrl', () => {
    // document.cookie's getter only ever returns "name=value" pairs, stripping all attributes
    // (Path, Expires, ...) - so we assert on the setter instead, to check the exact string
    // handed to the browser, attributes included.
    test.each<[CustomUser | null | undefined]>([[null], [undefined], [{ id_token: '' } as CustomUser]])(
        'returns the url unchanged and sets no cookie when user is %p (e.g. not logged in, or id_token blips during a renew)',
        (user) => {
            const setCookie = jest.spyOn(document, 'cookie', 'set');

            const result = setupAuthenticatedUrl(user, '/api/gateway/case/v1/cases/some-uuid');

            expect(result).toBe('/api/gateway/case/v1/cases/some-uuid');
            expect(setCookie).not.toHaveBeenCalled();
            setCookie.mockRestore();
        }
    );

    test('returns the url unchanged and sets no cookie when the user carries no accessTokenShares (should not normally happen)', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');

        // Fails safe instead of inventing a share on the spot - see setupAuthenticatedUrl's own
        // comment on this branch.
        const result = setupAuthenticatedUrl(
            { id_token: 'some-token' } as CustomUser,
            '/api/gateway/case/v1/cases/some-uuid'
        );

        expect(result).toBe('/api/gateway/case/v1/cases/some-uuid');
        expect(setCookie).not.toHaveBeenCalled();
        setCookie.mockRestore();
    });

    test('writes the two precomputed XOR shares to the cookie and the url as-is, recoverable together but not alone', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');

        const result = setupAuthenticatedUrl(
            mockLoggedInUser('some token/with special+chars'),
            '/api/gateway/case/v1/cases/some-uuid?fileName=myCase'
        );

        expect(setCookie).toHaveBeenCalledTimes(1);
        const written = setCookie.mock.calls[0][0];
        // No Expires here: the mocked user has no expires_at - see the Expires-specific tests
        // below. No Secure, no SameSite: see setupAuthenticatedUrl's own comment on why neither
        // is needed.
        expect(written).toMatch(
            new RegExp(`^${ACCESS_TOKEN_SHARE_COOKIE_NAME}=[A-Za-z0-9_-]+; Path=/api/gateway/case/v1/cases/some-uuid$`)
        );
        // no Domain attribute: the cookie defaults to host-only scope, so it's never sent to
        // sibling/parent domains.
        expect(written).not.toMatch(/domain=/i);

        const cookieShare = extractCookieShare(written);
        const queryShare = new URL(result, 'https://example.org').searchParams.get(ACCESS_TOKEN_SHARE_QUERY_PARAM);
        expect(queryShare).not.toBeNull();

        // Neither share alone looks anything like the token...
        expect(cookieShare).not.toContain('some token');
        expect(queryShare).not.toContain('some token');
        // ...but XOR-ing them back together recovers it, exactly like the gateway does.
        const recovered = new TextDecoder().decode(xor(base64UrlDecode(cookieShare), base64UrlDecode(queryShare!)));
        expect(recovered).toBe('some token/with special+chars');

        setCookie.mockRestore();
    });

    test('appends the query param without altering the rest of the url', () => {
        const result = setupAuthenticatedUrl(
            mockLoggedInUser('some-token'),
            'https://my.domain.com/api/gateway/case/v1/cases/some-uuid?fileName=myCase&other=1'
        );

        expect(result).toMatch(
            /^https:\/\/my\.domain\.com\/api\/gateway\/case\/v1\/cases\/some-uuid\?fileName=myCase&other=1&access_token_share=[A-Za-z0-9_-]+$/
        );
    });

    test('scopes the cookie to the path only, excluding the query string', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');

        setupAuthenticatedUrl(
            mockLoggedInUser('some-token'),
            'https://my.domain.com/api/gateway/case/v1/cases/some-uuid?fileName=myCase&other=1'
        );

        const written = setCookie.mock.calls[0][0];
        // Path is the last attribute now (no Secure/SameSite after it - see
        // setupAuthenticatedUrl's own comment on why neither is needed), so it's not followed by
        // a trailing `;`.
        expect(written).toMatch(/Path=\/api\/gateway\/case\/v1\/cases\/some-uuid$/);
        expect(written).not.toContain('fileName');
        setCookie.mockRestore();
    });

    test('uses the exact shares from the user object passed in, consistently for the same user and differently for a different one', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');
        const userA = mockLoggedInUser('token-a');
        const userB = mockLoggedInUser('token-b');

        setupAuthenticatedUrl(userA, '/first');
        setupAuthenticatedUrl(userA, '/second');
        setupAuthenticatedUrl(userB, '/third');

        const [firstShare, secondShare, thirdShare] = setCookie.mock.calls.map((call) => extractCookieShare(call[0]));
        // Same user (see dispatchUser/generateAccessTokenShares in authService.ts, the only place
        // accessTokenShares is ever set) -> same share, across both calls...
        expect(secondShare).toBe(firstShare);
        // ...a different user (e.g. after a token renewal) -> a different share.
        expect(thirdShare).not.toBe(firstShare);

        setCookie.mockRestore();
    });

    test('sets the cookie Expires from user.expires_at when available', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');
        const expiresAt = 1735689600; // 2025-01-01T00:00:00Z - arbitrary but fixed, for an exact assertion below

        setupAuthenticatedUrl(
            mockLoggedInUser('some-token', { expires_at: expiresAt }),
            '/api/gateway/case/v1/cases/some-uuid'
        );

        expect(setCookie.mock.calls[0][0]).toContain(`Expires=${new Date(expiresAt * 1000).toUTCString()};`);

        setCookie.mockRestore();
    });

    test('omits the Expires attribute entirely when expires_at is unavailable', () => {
        const setCookie = jest.spyOn(document, 'cookie', 'set');

        setupAuthenticatedUrl(mockLoggedInUser('some-token'), '/api/gateway/case/v1/cases/some-uuid');

        expect(setCookie.mock.calls[0][0]).not.toContain('Expires');

        setCookie.mockRestore();
    });
});
