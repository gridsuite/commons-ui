/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import type { UserManager } from 'oidc-client';

export interface SignInCallbackHandlerProps {
    userManager: UserManager | null;
    handleSignInCallback: () => void;
}

export function SignInCallbackHandler({ userManager, handleSignInCallback }: SignInCallbackHandlerProps) {
    useEffect(() => {
        if (userManager !== null) {
            handleSignInCallback();
        }
    }, [userManager, handleSignInCallback]);

    return <h1> </h1>;
}
