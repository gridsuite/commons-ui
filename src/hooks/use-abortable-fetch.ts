/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { IGNORE_SIGNAL } from '../services';

type UseAbortableFetchOptions<TData> = {
    fetcher: (signal: AbortSignal) => Promise<TData> | undefined;
    deps: any[];
    skipFetch?: boolean;
    timeoutMs?: number;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    cleanup?: () => void;
    delayMs?: number; // for delayed loading reset
};

export function useAbortableFetch<TData>({
    fetcher,
    deps,
    skipFetch = false,
    timeoutMs,
    onSuccess,
    onError,
    cleanup,
    delayMs = 500,
}: UseAbortableFetchOptions<TData>) {
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onFetchEvent = useEffectEvent(fetcher);
    const onSuccessEvent = useEffectEvent(onSuccess ?? (() => {}));
    const onErrorEvent = useEffectEvent(onError ?? (() => {}));
    const onCleanupEvent = useEffectEvent(cleanup ?? (() => {}));

    useEffect(() => {
        if (skipFetch) {
            setLoading(false);
            return () => {};
        }

        const controller = new AbortController();
        const signals: AbortSignal[] = [controller.signal];
        if (timeoutMs) {
            signals.push(AbortSignal.timeout(timeoutMs));
        }
        const signal = signals.length > 1 ? AbortSignal.any(signals) : controller.signal;

        // the consumer may not provide a fetcher, in that case we just return
        const fetcherWithSignal = onFetchEvent(signal);
        if (!fetcherWithSignal) {
            setLoading(false);
            return () => {};
        }

        setLoading(true);
        fetcherWithSignal
            .then((fetchedData) => {
                // custom success handling if needed
                onSuccessEvent(fetchedData);
                // delay loading reset to avoid flickering in case of very fast requests
                if (delayMs) {
                    timeoutRef.current = setTimeout(() => {
                        setLoading(false);
                    }, delayMs);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                // treat manual abort as a special case => silently ignore
                if (signal.aborted && signal.reason?.message === IGNORE_SIGNAL) {
                    return;
                }
                // other cases => treat as a normal error, including the timeout abort
                setLoading(false);
                // custom error handling if needed
                onErrorEvent(error);
            });

        // clean up
        return () => {
            controller?.abort(new Error(IGNORE_SIGNAL));

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // custom cleanup if needed
            onCleanupEvent();
        };
        // dependencies must include primitive value params passed to the hook, but not event callbacks
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipFetch, timeoutMs, delayMs, ...deps]);

    return { loading };
}
