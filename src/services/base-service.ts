/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable max-classes-per-file */

import { User } from 'oidc-client';
import { HttpContentType, InitRequest, setRequestHeader, Token, Url, UrlString } from '../utils/api';
import { safeFetch } from '../utils/api/api-rest';

/* The first problem we have here is that some front apps don't use Vite, and by consequence using VITE_* vars don't work...
 * What we do here is to try to use these variables as default, while permitting devs to overwrite these constants.
 *
 * The second problem is to how to keep organized the fetcher by service while letting devs add to others in apps.
 * Using named export was try but isn't extendable (some sort of "import namespace").
 *
 * The third problem is how to manage the user token ID that comes from the app's side for now.
 * We can't use React context, and using a pseudo store copy isn't a satisfying solution.
 */

export type UserGetter = () => User | undefined;

/* Note: some utilities functions are moved in the class as it's a dependant of runtime data
 * Note: the baseUrlPrefix isn't in the base because websocket services haven't a version in url
 */
abstract class BaseService {
    private readonly getUser: UserGetter;

    protected constructor(userGetter: UserGetter) {
        this.getUser = userGetter;
    }

    protected getUserToken(user?: User) {
        return (user ?? this.getUser())?.id_token;
    }
}

export abstract class WsService extends BaseService {
    protected readonly queryPrefix: string;

    protected constructor(
        userGetter: UserGetter,
        service: string,
        wsGatewayPath: UrlString = import.meta.env.VITE_WS_GATEWAY
    ) {
        super(userGetter);
        this.queryPrefix = `${WsService.getWsBase(wsGatewayPath)}/${service}`;
    }

    private static getWsBase(wsGatewayPath: string): string {
        // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
        return document.baseURI.replace(/^http(s?):\/\//, 'ws$1://').replace(/\/+$/, '') + wsGatewayPath;
    }

    protected getUrlWithToken(baseUrl: string) {
        const querySymbol = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${querySymbol}access_token=${this.getUserToken()}`;
    }
}

export abstract class ApiService extends BaseService {
    private readonly basePrefix: string;

    protected constructor(
        userGetter: UserGetter,
        service: string,
        restGatewayPath: UrlString = import.meta.env.VITE_API_GATEWAY
    ) {
        super(userGetter);
        this.basePrefix = `${ApiService.getRestBase(restGatewayPath)}/${service}`;
    }

    private static getRestBase(restGatewayPath: string): string {
        // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
        return document.baseURI.replace(/\/+$/, '') + restGatewayPath;
    }

    /**
     * Return the base API prefix to the server
     * @param vApi the version of api to use
     */
    protected getPrefix(vApi: number) {
        return `${this.basePrefix}/config/v${vApi}`;
    }

    private prepareRequest(init?: InitRequest, token?: Token): RequestInit {
        if (!(typeof init === 'undefined' || typeof init === 'string' || typeof init === 'object')) {
            throw new TypeError(`First argument of prepareRequest is not an object: ${typeof init}`);
        }
        const initCopy: RequestInit = typeof init === 'string' ? { method: init } : { ...(init ?? {}) };
        initCopy.headers = new Headers(initCopy.headers || {});
        const tokenCopy = token || this.getUserToken();
        initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
        return initCopy;
    }

    protected backendFetch(url: Url<false>, init?: InitRequest, token?: Token) {
        return safeFetch(url, this.prepareRequest(init, token));
    }

    protected async backendFetchJson<TReturn = unknown>(
        url: Url<false>,
        init?: InitRequest,
        token?: Token
    ): Promise<TReturn> {
        const reqInit = setRequestHeader(init, 'accept', HttpContentType.APPLICATION_JSON);
        return (await this.backendFetch(url, reqInit, token)).json();
    }

    protected async backendFetchText(url: Url<false>, init?: InitRequest, token?: Token) {
        const reqInit = setRequestHeader(init, 'accept', HttpContentType.TEXT_PLAIN);
        return (await this.backendFetch(url, reqInit, token)).text();
    }

    protected async backendFetchFile(url: Url<false>, init?: InitRequest, token?: Token) {
        return (await this.backendFetch(url, init, token)).blob();
    }
}
