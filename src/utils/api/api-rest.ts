/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IncomingHttpHeaders } from 'node:http';
import { LiteralUnion } from 'type-fest';
import { FileType } from './utils';
import { KeyOfWithoutIndexSignature } from '../types';

export type UrlString = `${string}://${string}` | `/${string}` | `./${string}`;
export type Url<Check extends boolean = true> = (Check extends true ? UrlString : string) | URL;
export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type StandardHeader = keyof KeyOfWithoutIndexSignature<IncomingHttpHeaders>;
export type HttpHeaderName = LiteralUnion<StandardHeader, string>;
type HeadersInitExt = [HttpHeaderName, string][] | Partial<Record<HttpHeaderName, string>> | Headers;

export enum HttpContentType {
    APPLICATION_OCTET_STREAM = 'application/octet-stream',
    APPLICATION_JSON = 'application/json',
    TEXT_PLAIN = 'text/plain',
}

type RequestInitExt = RequestInit & {
    method?: HttpMethod;
    headers?: HeadersInitExt;
};
export type InitRequest = HttpMethod | Partial<RequestInitExt>;
export type InitRequestSend = HttpMethod | Partial<Omit<RequestInitExt, 'body'>>;
export type Token = string;

export interface ErrorWithStatus extends Error {
    status?: number;
}

function parseError(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

async function handleError(response: Response): Promise<never> {
    const errorName = 'HttpResponseError : ';
    let error: ErrorWithStatus;
    const errorJson = parseError(await response.text());
    if (errorJson?.status && errorJson?.error && errorJson?.message) {
        error = new Error(
            `${errorName}${errorJson.status} ${errorJson.error}, message: ${errorJson.message}`
        ) as ErrorWithStatus;
        error.status = errorJson.status;
    } else {
        error = new Error(`${errorName}${response.status} ${response.statusText}`) as ErrorWithStatus;
        error.status = response.status;
    }
    throw error;
}

export async function safeFetch(url: Url<false>, reqInit: RequestInit) {
    const response = await fetch(url, reqInit);
    return response.ok ? response : handleError(response);
}

type ExpandedInitRequest = Partial<RequestInitExt> & {
    headers: Headers;
};
export function expandInitRequest(initReq: InitRequest | undefined) {
    const result: Partial<RequestInitExt> =
        typeof initReq === 'string'
            ? {
                  method: initReq,
              }
            : initReq ?? {};
    if (!(result.headers instanceof Headers)) {
        // && result.headers?.constructor?.name !== 'Headers'
        result.headers = new Headers(result.headers);
    }
    return result as ExpandedInitRequest;
}

export function setRequestHeader(initReq: InitRequest | undefined, name: HttpHeaderName, value: string) {
    const result = expandInitRequest(initReq);
    result.headers.set(name, value);
    return result;
}

export function downloadFile(blob: Blob, filename: string, type?: FileType) {
    let contentType;
    if (type === FileType.ZIP) {
        contentType = HttpContentType.APPLICATION_OCTET_STREAM;
    }
    const href = window.URL.createObjectURL(new Blob([blob], { type: contentType }));
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
