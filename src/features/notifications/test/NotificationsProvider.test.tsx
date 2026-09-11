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
import type { User } from 'oidc-client-ts';
import { NotificationsProvider } from '../NotificationsProvider';
import { useNotificationsListener } from '../hooks/useNotificationsListener';
import { ACCESS_TOKEN_SHARE_COOKIE_NAME } from '../../../services';

jest.mock('reconnecting-websocket');
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));
// Mocking the concrete ../../../redux/commonStore module (rather than the ../../../redux
// barrel) so this also covers setupAuthenticatedUrl in ../../../services/utils.ts, which
// imports getUser directly from commonStore rather than through the barrel.
jest.mock('../../../redux/commonStore', (): typeof import('../../../redux/commonStore') => ({
    ...jest.requireActual<typeof import('../../../redux/commonStore')>('../../../redux/commonStore'),
    getUserToken: () => 'fake-token',
    // expires_at drives the AccessTokenShare cookie's Expires, and accessTokenShares are the two
    // precomputed split-token shares (see CustomUser/generateAccessTokenShares in
    // ../../../features/authentication/utils/authService.ts and setupAuthenticatedUrl in
    // ../../../services/utils.ts, which now receives this whole user object directly instead of
    // calling getUser() itself) - id_token matches the getUserToken() mock above; the shares'
    // exact values don't matter here (only that setupAuthenticatedUrl relays them as-is, checked
    // below), so they're just fixed placeholder strings, not a real XOR pair.
    getUser: () =>
        ({
            profile: {},
            id_token: 'fake-token',
            expires_at: 1735689600, // 2025-01-01T00:00:00Z - arbitrary but fixed, for an exact assertion below
            accessTokenShares: ['fake-cookie-share', 'fake-query-share'],
        }) as unknown as User,
}));
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

    test('splits the token via XOR into a transient cookie share and a url query share, instead of putting the raw token in the URL', () => {
        const root = createRoot(container);
        const setCookie = jest.spyOn(document, 'cookie', 'set');

        act(() => {
            root.render(<NotificationsProvider urls={{ [WS_KEY]: 'test' }} />);
        });

        // NotificationsProvider passes a URL-provider function (not a plain string) to
        // ReconnectingWebSocket, so that it can refresh the split shares on every (re)connect.
        const urlProvider = MockedReconnectingWebSocket.mock.calls[0][0] as () => string;
        expect(setCookie).not.toHaveBeenCalled();

        const url = urlProvider();

        // the raw token never goes in the URL...
        expect(url).not.toContain('fake-token');
        expect(url).toBe('test?access_token_share=fake-query-share');
        // ...its complementary share is set as a short-lived, non-HttpOnly cookie right
        // before connecting, scoped via Path to this WebSocket's own URL so it isn't sent along
        // with unrelated API calls.
        expect(setCookie).toHaveBeenCalledTimes(1);
        expect(setCookie.mock.calls[0][0]).toBe(
            `${ACCESS_TOKEN_SHARE_COOKIE_NAME}=fake-cookie-share; Expires=${new Date(1735689600 * 1000).toUTCString()}; Path=/test`
        );

        setCookie.mockRestore();
    });
});
