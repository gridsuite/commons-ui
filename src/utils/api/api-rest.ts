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

export async function safeFetch(url: Url<false>, initCopy: RequestInit) {
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
