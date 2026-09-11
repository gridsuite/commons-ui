/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore';
import { ProblemDetailError } from '../utils/types/ProblemDetailError';
import { NetworkTimeoutError } from '../utils/types/NetworkTimeoutError';
import { CustomError } from '../utils/types/CustomError';
import { fetchSplitTokenConfig } from './appsMetadata';
import type { CustomUser } from '../features/authentication/utils/authService';

export const DEFAULT_TIMEOUT_MS = 50_000;
export const IGNORE_SIGNAL = 'IGNORE_SIGNAL';

/**
 * Name of the query string parameter carrying a whole (unsplit) access token by itself. Must
 * match the gateway's ACCESS_TOKEN_QUERY_PARAM constant. Used as-is (see setupAuthenticatedUrl)
 * when the split-token mechanism is rolled back (see the rollback config below).
 */
export const ACCESS_TOKEN_QUERY_PARAM = 'access_token';

/**
 * Name of the cookie carrying one half of the split access token (see setupAuthenticatedUrl).
 * Must match the gateway's ACCESS_TOKEN_SHARE_COOKIE_NAME constant.
 * No `Domain` attribute is ever set below, so the cookie defaults to host-only scope (never sent
 * to sibling/parent domains). No `Secure` attribute either (see setupAuthenticatedUrl for why),
 * so this also works unchanged on plain-HTTP local dev, without needing to special-case
 * `localhost`.
 */
export const ACCESS_TOKEN_SHARE_COOKIE_NAME = 'AccessTokenShare';

/**
 * Name of the query string parameter carrying the other half of the split access token. Must
 * match the gateway's ACCESS_TOKEN_SHARE_QUERY_PARAM constant.
 */
export const ACCESS_TOKEN_SHARE_QUERY_PARAM = 'access_token_share';

function appendQueryParam(url: string, name: string, value: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${name}=${encodeURIComponent(value)}`;
}

// ================================ SPLIT-TOKEN ROLLBACK: START =================================
// Everything in this block exists solely so ops can disable the split-token mechanism (see
// setupAuthenticatedUrl below, and dispatchUser in
// ../features/authentication/utils/authService.ts) via a dynamically-served split-token.json
// file, without a frontend redeploy, if a problem is found with it. Once the mechanism has proven
// itself in production and this rollback capability is no longer needed, we may remove it - this
// whole block; the `isSplitTokenDisabled()` calls in setupAuthenticatedUrl below and dispatchUser;
// fetchSplitTokenConfig()/SplitTokenConfig in ./appsMetadata (and the resulting now-unused import
// above); and split-token.json itself, wherever it ends up deployed - but that's just future
// cleanup, not a requirement.
let splitTokenDisabled = false;
let splitTokenConfigLoadStarted = false;

/**
 * Fetches split-token.json (see SplitTokenConfig) at most once per page load, and updates
 * whether the split-token mechanism actually splits the token via XOR, or falls back to sending
 * it whole in the access_token query parameter like before this mechanism existed. Triggered
 * automatically by the first call to isSplitTokenDisabled below, so nothing needs to be wired up
 * at app startup. Any failure (file not deployed, network error, ...) is swallowed and treated as
 * "keep splitting" - the more secure default, also why splitTokenDisabled itself defaults to
 * false.
 */
function loadSplitTokenRollbackConfigOnce(): void {
    if (splitTokenConfigLoadStarted) {
        return;
    }
    splitTokenConfigLoadStarted = true;
    fetchSplitTokenConfig()
        .then((config) => {
            splitTokenDisabled = config.disable ?? false;
            console.info(`split-token mechanism is ${splitTokenDisabled ? 'DISABLED (rollback)' : 'enabled'}`);
        })
        .catch((error) => console.warn('Could not fetch split-token.json, split-token mechanism stays enabled', error));
}

/**
 * Whether the split-token mechanism is currently known to be disabled via rollback config. Used
 * by setupAuthenticatedUrl below to decide whether to actually split the token, and by
 * dispatchUser (see ../features/authentication/utils/authService.ts) to skip generating and
 * attaching accessTokenShares to the user at all in that case - no point holding onto shares that
 * will never be used.
 *
 * Triggers loading the config if not already in flight (see loadSplitTokenRollbackConfigOnce
 * above), so this is safe to call as the very first thing that needs it (e.g. from dispatchUser,
 * which runs before any request needs setupAuthenticatedUrl). Like the rest of this rollback
 * mechanism, the config load is asynchronous, so a call made before it resolves still sees the
 * safe default (false, i.e. enabled).
 */
export function isSplitTokenDisabled(): boolean {
    loadSplitTokenRollbackConfigOnce();
    return splitTokenDisabled;
}
// ================================= SPLIT-TOKEN ROLLBACK: END ===================================

/**
 * Writes `user`'s two precomputed XOR shares (see CustomUser/generateAccessTokenShares in
 * ../features/authentication/utils/authService.ts, which base64url-encodes both ahead of time) so
 * that neither channel alone carries a usable token: the cookie share, written to the
 * `AccessTokenShare` cookie (Path-scoped to `url`, and expiring at the same time as the token
 * itself so it never outlives it, see user.expires_at below), and the query share, appended to
 * `url` as the `access_token_share` query parameter. The gateway recombines both with a single
 * XOR; it never sees the raw token in a URL or access log.
 *
 * Meant to be called by JS immediately before issuing a request that needs auth in the url itself
 * (the browser sends the request on its own, so a custom Authorization header can't be
 * attached, and the token has to travel some other way). No-op (returns `url` unchanged) if there
 * is no token (e.g. logged out).
 *
 * @param user the current authenticated user (see getUser()); its id_token, accessTokenShares and
 * expires_at fields are used for the (rollback) whole token, the two precomputed shares, and the
 * cookie's expiry, respectively
 * @param url the exact URL of the request this split is meant for; only its path (query string
 * excluded, cookies don't match on it) is used to scope the cookie
 * @returns `url` with the `access_token_share` query parameter appended (or, if the split-token
 * mechanism is rolled back, the whole token in the `access_token` query parameter instead) - use
 * this as the actual request URL
 */
export function setupAuthenticatedUrl(user: CustomUser | null | undefined, url: string): string {
    const token = user?.id_token;
    if (!token) {
        return url;
    }
    // Rollback config: see the matching block above - this line would go together with it if we
    // ever remove that block.
    if (isSplitTokenDisabled()) {
        return appendQueryParam(url, ACCESS_TOKEN_QUERY_PARAM, token);
    }

    // Both shares are generated and base64url-encoded once already (see
    // CustomUser/generateAccessTokenShares in
    // ../features/authentication/utils/authService.ts), right as the token itself gets stored,
    // before it's ever visible via getUser() (which is how callers obtain the user passed in
    // here) - so by the time a token is available to split at all, its shares already are too,
    // and there's no XOR-ing or encoding left to do here.
    const shares = user?.accessTokenShares;
    if (!shares) {
        // Should not normally happen (see above) - fails safe like the !token case above,
        // instead of inventing fresh shares here: repeated calls need to agree on the exact same
        // shares to avoid racing with themselves (see the cookie-writing comment below).
        return url;
    }
    const [cookieShare, queryShare] = shares;

    // Must use document.baseURI here (not just window.location.origin), consistently with each
    // app's getWsBase(): it reconstructs the effective base of the current document (honoring a
    // <base> tag, e.g. when the SPA is served from a subpath like my.domain.com/spa1/), which is
    // what we need to reconstruct the correct Path for the cookie below. Today `url` is always
    // absolute already (so this base is actually never used to resolve anything), but modern
    // browsers now support relative WebSocket URLs (Firefox 124+, Chrome 125+), so this keeps us
    // ready to accept a relative `url` here too, if we ever want to, without silently getting the
    // cookie's Path wrong.
    const { pathname } = new URL(url, document.baseURI);
    // expires_at is a fixed point in time (unlike expires_in, a duration re-computed relative to
    // whenever it's read) - using it straight for Expires gives the cookie the exact right
    // lifetime, with no drift from recomputing a Max-Age duration between token issuance and
    // this call.
    const expiresAt = user?.expires_at;
    // We expect the `url`s passed to setupAuthenticatedUrl across the app to be disjoint (e.g. one
    // WS endpoint's path isn't a prefix of another's), so the browser never has more than one
    // AccessTokenShare cookie to choose from for a given request - a request matching two of
    // them would just fail (the wrong share XORs into garbage, not a valid token), not leak
    // anything.
    // For a given user, the cookie's value and Expires below are both fixed (accessTokenShares
    // and expires_at are only ever updated together, by dispatchUser, whenever a fresh user is
    // dispatched), so re-writing the same-path cookie on every call is a no-op in practice and
    // doesn't race with itself - except for a short window around a token renewal, where a
    // request built just before the renewal could still be in flight while this line overwrites
    // the cookie with the new token's share. This holds across tabs too, not just repeated calls
    // within one tab: dispatchUser derives accessTokenShares via getOrCreateAccessTokenShares
    // (see ../features/authentication/utils/authService.ts), which persists the shares it
    // generates to localStorage (shared across tabs, unlike this module's own state) so that
    // every tab holding the same token converges on the exact same shares, instead of each tab
    // racing the others by writing its own independently-random pair to this shared cookie.
    // This is deliberate: the split exists to prevent CSRF (a lone cookie would otherwise be
    // replayed automatically by the browser on any request, including attacker-triggered ones),
    // not to bind the cookie to one specific request or client - any client holding a valid
    // token, and only such a client, is meant to be able to authenticate this way. That's also
    // why this cookie needs neither Secure (it's only ever set/read by our own JS, never
    // HttpOnly, exactly like a plain fetch call we already allow over http for convenience - so
    // Secure would gain nothing here, while breaking plain-HTTP local dev) nor an explicit
    // SameSite (the default, Lax, is already enough: this cookie alone never authenticates
    // anything, only paired with its matching query share, which only our own JS can construct).
    document.cookie = `${ACCESS_TOKEN_SHARE_COOKIE_NAME}=${cookieShare}; ${
        expiresAt !== undefined ? `Expires=${new Date(expiresAt * 1000).toUTCString()}; ` : ''
    }Path=${pathname}`;

    return appendQueryParam(url, ACCESS_TOKEN_SHARE_QUERY_PARAM, queryShare);
}

/** Optional convenience: allow per-call timeout override without crafting a signal manually. */
type FetchInitWithTimeout = RequestInit & {
    /** If provided and no signal is set, use this as the timeout override (ms). */
    timeoutMs?: number;
};

/**
 * Ensure we always have an AbortSignal: use caller-provided signal if any,
 * otherwise apply a default timeout (30s by default, overridable via timeoutMs).
 */
const ensureSignal = (init?: FetchInitWithTimeout): RequestInit => {
    if (init?.signal) return init;

    const timeoutMs = typeof init?.timeoutMs === 'number' ? init.timeoutMs : DEFAULT_TIMEOUT_MS;

    return {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
    };
};

const prepareRequest = (init: FetchInitWithTimeout | undefined, token?: string) => {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(`First argument of prepareRequest is not an object : ${typeof init}`);
    }

    // Apply default/global timeout signal logic
    const initWithSignal = ensureSignal(init);

    // Add Authorization header
    initWithSignal.headers = new Headers(initWithSignal.headers || {});
    const tokenCopy = token ?? getUserToken();
    initWithSignal.headers.append('Authorization', `Bearer ${tokenCopy}`);

    return initWithSignal;
};

type ProblemDetailDto = {
    status: number;
    server: string;
    timestamp: string;
    traceId: string;
    detail: string;
    businessErrorCode?: string;
    businessErrorValues?: Record<string, unknown>;
};

const isProblemDetail = (error: unknown): error is ProblemDetailDto => {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const e = error as Record<string, unknown>;

    return (
        typeof e.status === 'number' &&
        typeof e.server === 'string' &&
        typeof e.timestamp === 'string' &&
        typeof e.traceId === 'string' &&
        typeof e.detail === 'string'
    );
};

export const parseError = (errorTxt: string) => {
    let error: unknown;
    try {
        error = JSON.parse(errorTxt);
    } catch {
        return new Error(errorTxt);
    }

    if (isProblemDetail(error)) {
        return new ProblemDetailError(
            error.status,
            error.detail,
            error.server,
            error.timestamp,
            error.traceId,
            error.businessErrorCode,
            error.businessErrorValues
        );
    }

    return new Error(errorTxt);
};

export const handleNotOkResponse = async (response: Response): Promise<never> => {
    let bodyText: string;

    try {
        bodyText = await response.text();
    } catch (error) {
        throw new CustomError(response.status, 'Error in error: unable to read response body', {
            cause: error,
        });
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json') && !contentType.includes('application/problem+json')) {
        throw new CustomError(response.status, bodyText);
    }

    let body: unknown;
    try {
        body = JSON.parse(bodyText);
    } catch (error) {
        throw new CustomError(response.status, `Error in error: unable to parse json response from text\n${bodyText}`, {
            cause: error,
        });
    }

    if (isProblemDetail(body)) {
        throw new ProblemDetailError(
            body.status,
            body.detail,
            body.server,
            body.timestamp,
            body.traceId,
            body.businessErrorCode,
            body.businessErrorValues
        );
    }

    throw new CustomError(response.status, bodyText);
};

const handleTimeoutError = (error: unknown) => {
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        throw new NetworkTimeoutError();
    }
    throw error;
};

const safeFetch = (url: string, initCopy: RequestInit) => {
    return fetch(url, initCopy)
        .then((response) => (response.ok ? response : handleNotOkResponse(response)))
        .catch(handleTimeoutError);
};

export const backendFetch = (url: string, init?: FetchInitWithTimeout, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

export const backendFetchJson = (url: string, init?: FetchInitWithTimeout, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => (safeResponse.status === 204 ? null : safeResponse.json()));
};

export function backendFetchText(url: string, init?: FetchInitWithTimeout, token?: string) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.text());
}

export const backendFetchFile = (url: string, init: RequestInit, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.blob());
};

export const getRequestParamFromList = (paramName: string, params: string[] = []) => {
    return new URLSearchParams(params.map((param) => [paramName, param]));
};

export function safeEncodeURIComponent(value: string | null | undefined): string {
    return value != null ? encodeURIComponent(value) : '';
}
