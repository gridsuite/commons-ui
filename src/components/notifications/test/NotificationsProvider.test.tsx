/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createRoot } from 'react-dom/client';
import { act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { NotificationsProvider } from '../NotificationsProvider';
import { useNotificationsListener } from '../hooks/useNotificationsListener';

jest.mock('reconnecting-websocket');
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));
const MockedReconnectingWebSocket = ReconnectingWebSocket as jest.MockedClass<typeof ReconnectingWebSocket>;

let container: Element;

declare global {
    interface Window {
        ReconnectingWebSocket: any;
    }
}

const WS_CONSUMER_ID = 'WS_CONSUMER_ID';
const WS_KEY = 'WS_KEY';

describe('NotificationsProvider', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container?.remove();
    });

    test('renders NotificationsProvider component', () => {
        const root = createRoot(container);

        act(() => {
            root.render(<NotificationsProvider urls={{ [WS_KEY]: 'test' }} />);
        });
        expect(ReconnectingWebSocket).toHaveBeenCalled();
    });

    test('renders NotificationsProvider children component ', () => {
        const root = createRoot(container);

        act(() => {
            root.render(
                <NotificationsProvider urls={{ [WS_KEY]: 'test' }}>
                    <p id={WS_CONSUMER_ID}>Child</p>
                </NotificationsProvider>
            );
        });
        const lastMsg = document.querySelector(`#${WS_CONSUMER_ID}`);
        expect(lastMsg?.textContent).toEqual('Child');
    });

    test('renders NotificationsProvider children component and updated by event ', async () => {
        const root = createRoot(container);

        const eventCallback = jest.fn();
        function NotificationsConsumer() {
            useNotificationsListener(WS_KEY, { listenerCallbackMessage: eventCallback });
            return <p>empty</p>;
        }

        const reconnectingWebSocketClass = {} as jest.Mocked<ReconnectingWebSocket>;
        MockedReconnectingWebSocket.mockImplementation(() => reconnectingWebSocketClass);

        act(() => {
            root.render(
                <NotificationsProvider urls={{ [WS_KEY]: 'test' }}>
                    <NotificationsConsumer />
                </NotificationsProvider>
            );
        });
        const event = { data: 'test' } as MessageEvent<any>;
        act(() => {
            reconnectingWebSocketClass.onmessage?.(event);
        });

        waitFor(() => expect(eventCallback).toHaveBeenCalledWith(event));
    });

    test('renders NotificationsProvider children component not called with other key ', () => {
        const root = createRoot(container);

        const eventCallback = jest.fn();
        function NotificationsConsumer() {
            useNotificationsListener('Fake_Key', { listenerCallbackMessage: eventCallback });
            return <p>empty</p>;
        }

        const reconnectingWebSocketClass = {} as jest.Mocked<ReconnectingWebSocket>;
        MockedReconnectingWebSocket.mockImplementation(() => reconnectingWebSocketClass);

        act(() => {
            root.render(
                <NotificationsProvider urls={{ [WS_KEY]: 'test' }}>
                    <NotificationsConsumer />
                </NotificationsProvider>
            );
        });
        act(() => {
            reconnectingWebSocketClass.onmessage?.({ data: 'test' } as MessageEvent<any>);
        });

        expect(eventCallback).not.toHaveBeenCalled();
    });

    test('renders NotificationsProvider component and calls onOpen callback', async () => {
        const root = createRoot(container);

        const onOpenCallback = jest.fn();
        const reconnectingWebSocketClass = {
            onopen: onOpenCallback,
        } as Partial<ReconnectingWebSocket> as jest.Mocked<ReconnectingWebSocket>;
        const eventCallback = jest.fn();
        function NotificationsConsumer() {
            useNotificationsListener('Fake_Key', { listenerCallbackOnReopen: eventCallback });
            return <p>empty</p>;
        }

        MockedReconnectingWebSocket.mockImplementation(() => reconnectingWebSocketClass);

        act(() => {
            root.render(
                <NotificationsProvider urls={{ [WS_KEY]: 'test' }}>
                    <NotificationsConsumer />
                </NotificationsProvider>
            );
        });

        waitFor(() => expect(onOpenCallback).toHaveBeenCalled());
    });
});
