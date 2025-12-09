/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@design-system-rte/react';
import { useIntl } from 'react-intl';

interface CancelButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CancelButton({ onClick }: Readonly<CancelButtonProps>) {
    const intl = useIntl();
    return (
        <Button
            label={intl.formatMessage({ id: 'cancel' })}
            data-testid="CancelButton"
            onClick={onClick}
            variant="text"
        />
    );
}
