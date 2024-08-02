/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import ReconnectingWebSocket from 'reconnecting-websocket';
import Websocket from '../Websocket';
import useListener from '../hooks/useListener';
import { waitFor } from '@testing-library/react';

jest.mock('reconnecting-websocket');
let container: Element;

declare global {
    interface Window {
        ReconnectingWebSocket: any;
    }
}

const WS_CONSUMER_ID = 'WS_CONSUMER_ID';
const WS_KEY = 'WS_KEY';

describe('Websocket', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container?.remove();
    });

    test('renders Websocket component', () => {
        const root = createRoot(container);

        act(() => {
            root.render(<Websocket urls={{ [WS_KEY]: 'test' }} />);
        });
        expect(ReconnectingWebSocket).toBeCalled();
    });

    test('renders Websocket children component ', () => {
        const root = createRoot(container);

        act(() => {
            root.render(
                <Websocket urls={{ [WS_KEY]: 'test' }}>
                    <p id={WS_CONSUMER_ID}>Child</p>
                </Websocket>
            );
        });
        const lastMsg = document.querySelector(`#${WS_CONSUMER_ID}`);
        expect(lastMsg?.textContent).toEqual('Child');
    });

    test('renders Websocket children component and updated by event ', async () => {
        const root = createRoot(container);

        const eventCallback = jest.fn();
        function WSConsumer() {
            useListener(WS_KEY, eventCallback);
            return <p>empty</p>;
        }

        const reconnectingWebSocketClass = {};
        // @ts-ignore
        ReconnectingWebSocket.mockImplementation(
            () => reconnectingWebSocketClass
        );

        act(() => {
            root.render(
                <Websocket urls={{ [WS_KEY]: 'test' }}>
                    <WSConsumer />
                </Websocket>
            );
        });
        const event = { test: 'test' };
        act(() => {
            // @ts-ignore
            reconnectingWebSocketClass.onmessage(event);
        });

        waitFor(() => expect(eventCallback).toBeCalledWith(event));
    });

    test('renders Websocket children component not called with other key ', () => {
        const root = createRoot(container);

        const eventCallback = jest.fn();
        function WSConsumer() {
            useListener('Fake_Key', eventCallback);
            return <p>empty</p>;
        }

        const reconnectingWebSocketClass = {};
        // @ts-ignore
        ReconnectingWebSocket.mockImplementation(
            () => reconnectingWebSocketClass
        );

        act(() => {
            root.render(
                <Websocket urls={{ [WS_KEY]: 'test' }}>
                    <WSConsumer />
                </Websocket>
            );
        });
        act(() => {
            // @ts-ignore
            reconnectingWebSocketClass.onmessage({ test: 'test' });
        });

        expect(eventCallback).not.toBeCalled();
    });
});