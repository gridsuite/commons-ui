/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IncomingHttpHeaders } from 'node:http';
import { LiteralUnion } from 'type-fest';
import { FileType, getUserToken } from './utils';
import { KeyOfWithoutIndexSignature } from '../types';

export type UrlString = `${string}://${string}` | `/${string}` | `./${string}`;
export type Url<Check extends boolean = true> =
    | (Check extends true ? UrlString : string)
    | URL;
export type HttpMethod =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';
type StandardHeader = keyof KeyOfWithoutIndexSignature<IncomingHttpHeaders>;
export type HttpHeaderName = LiteralUnion<StandardHeader, string>;

export enum HttpContentType {
    APPLICATION_OCTET_STREAM = 'application/octet-stream',
    APPLICATION_JSON = 'application/json',
    TEXT_PLAIN = 'text/plain',
}

type RequestInitExt = Omit<RequestInit, 'method'> & {
    method?: HttpMethod;
};
export type InitRequest = HttpMethod | Partial<RequestInitExt>;
export type Token = string;

export interface ErrorWithStatus extends Error {
    status?: number;
}

export function getRestBase(): string {
    // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
    return (
        document.baseURI.replace(/\/+$/, '') + import.meta.env.VITE_API_GATEWAY
    );
}

function prepareRequest(init?: InitRequest, token?: Token): RequestInit {
    if (
        !(
            typeof init === 'undefined' ||
            typeof init === 'string' ||
            typeof init === 'object'
        )
    ) {
        throw new TypeError(
            `First argument of prepareRequest is not an object: ${typeof init}`
        );
    }
    const initCopy: RequestInit =
        typeof init === 'string' ? { method: init } : { ...(init ?? {}) };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token || getUserToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
}

function parseError(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleError(response: Response): Promise<never> {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        let error: ErrorWithStatus;
        const errorJson = parseError(text);
        if (errorJson?.status && errorJson?.error && errorJson?.message) {
            error = new Error(
                `${errorName}${errorJson.status} ${errorJson.error}, message : ${errorJson.message}`
            ) as ErrorWithStatus;
            error.status = errorJson.status;
        } else {
            error = new Error(
                `${errorName}${response.status} ${response.statusText}`
            ) as ErrorWithStatus;
            error.status = response.status;
        }
        throw error;
    });
}

async function safeFetch(url: Url<false>, initCopy: RequestInit) {
    const response = await fetch(url, initCopy);
    return response.ok ? response : handleError(response);
}

export function setRequestHeader(
    initReq: InitRequest | undefined,
    name: HttpHeaderName,
    value: string
): Partial<RequestInitExt> {
    let result = initReq;
    if (result === undefined) {
        result = {};
    } else if (typeof result === 'string') {
        result = {
            method: result,
        };
    }
    result.headers = new Headers();
    result.headers.set(name, value);
    return result;
}

export function backendFetch(
    url: Url<false>,
    init?: InitRequest,
    token?: Token
) {
    return safeFetch(url, prepareRequest(init, token));
}

export async function backendFetchJson(
    url: Url<false>,
    init?: InitRequest,
    token?: Token
): Promise<unknown> {
    const reqInit = setRequestHeader(
        init,
        'accept',
        HttpContentType.APPLICATION_JSON
    );
    return (await backendFetch(url, reqInit, token)).json();
}

export async function backendFetchText(
    url: Url<false>,
    init?: InitRequest,
    token?: Token
) {
    const reqInit = setRequestHeader(
        init,
        'accept',
        HttpContentType.TEXT_PLAIN
    );
    return (await backendFetch(url, reqInit, token)).text();
}

export async function backendFetchFile(
    url: Url<false>,
    init?: InitRequest,
    token?: Token
) {
    return (await backendFetch(url, init, token)).blob();
}

export function downloadFile(blob: Blob, filename: string, type?: FileType) {
    let contentType;
    if (type === FileType.ZIP) {
        contentType = HttpContentType.APPLICATION_OCTET_STREAM;
    }
    const href = window.URL.createObjectURL(
        new Blob([blob], { type: contentType })
    );
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
