/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface UseSimpleTextValueProps {
    defaultValue: string;
    adornment: TextFieldProps['InputProps'];
    error: boolean;
    triggerReset: boolean;
}

export const useSimpleTextValue = ({ defaultValue, adornment, error, triggerReset }: UseSimpleTextValueProps) => {
    const [value, setValue] = useState(defaultValue);

    const handleChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }, []);

    const field = useMemo(() => {
        return (
            <TextField
                value={value}
                onChange={handleChangeValue}
                {...(adornment && { InputProps: adornment })}
                error={error !== undefined}
                autoFocus
                fullWidth
            />
        );
    }, [value, handleChangeValue, adornment, error]);

    useEffect(() => setValue(defaultValue), [defaultValue, triggerReset]);

    return [value, field] as const;
};
