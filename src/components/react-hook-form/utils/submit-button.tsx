/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import { useFormState } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const SubmitButton = ({ ...buttonProps }) => {
    const { isDirty } = useFormState();

    return (
        <Button
            {...buttonProps}
            disabled={!isDirty || (buttonProps?.disabled ?? false)}
        >
            <FormattedMessage id="validate" />
        </Button>
    );
};

SubmitButton.propTypes = {
    buttonProps: PropTypes.object,
};

export default SubmitButton;
