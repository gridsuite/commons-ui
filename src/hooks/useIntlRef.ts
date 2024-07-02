/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

// This useEffect must be at the beginning to be executed before other useEffects which use intlRef.
// This ref is used to avoid redoing other useEffects when the language (intl) is changed for things that produce temporary messages using the snackbar.
// The drawback to this custom hook is that a ref and a useEffect are created in each component that needs this hook.
// Can we avoid this overhead ?
function useIntlRef() {
    const intl = useIntl();
    const intlRef = useRef(intl);

    useEffect(() => {
        intlRef.current = intl;
    }, [intl]);

    return intlRef;
}

export default useIntlRef;
