/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Button } from '@design-system-rte/react';
import { PrimitiveType, useIntl } from 'react-intl';

interface SubmitButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    label?: string;
    labelValues?: Record<string, PrimitiveType>;
    disabled?: boolean;
}

export function ValidateButton({ onClick, label, labelValues, disabled }: Readonly<SubmitButtonProps>) {
    const intl = useIntl();

    return (
        <Button
            onClick={onClick}
            label={intl.formatMessage({ id: label ?? 'validate' }, labelValues)}
            disabled={disabled ?? false}
            variant="secondary"
            data-testid="ValidateButton"
        />
    );
}
