/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from 'oidc-client';

export type CommonStoreState = {
    user: User | null;
};

interface CommonStore {
    getState(): CommonStoreState;
}

let commonStore: CommonStore | undefined;

/**
 * Set a copy of the reference to the store to be able to access it from this library.
 * It's useful to get access to the user token outside of the React context in API files.
 * NB : temporary solution before refactoring the token management in the whole gridsuite stack.
 */
export function setCommonStore(store: CommonStore): void {
    commonStore = store;
}

export function getUser() {
    return commonStore?.getState().user ?? undefined;
}
