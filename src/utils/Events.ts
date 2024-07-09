/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default class Events {
    userLoadedCallbacks: ((data: any) => void)[] = [];

    addUserLoaded(callback: (data: any) => void) {
        this.userLoadedCallbacks.push(callback);
    }

    // eslint-disable-next-line class-methods-use-this
    addSilentRenewError() {
        // Nothing to do
    }
}
