/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DialogContent, DialogTitle, Grid } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { FieldConstants } from '../../../../../../../../utils';
import { SWITCH_TYPE } from '../../../../voltageLevelCreation.utils';
import { EnumInput } from '../../../../../../../inputs';

interface CreateSwitchesFormProps {
    id: string;
}

function CreateSwitchesForm({ id }: Readonly<CreateSwitchesFormProps>) {
    const { fields: rows } = useFieldArray({ name: `${id}` });
    return (
        <>
            <DialogTitle>
                <FormattedMessage id="SwitchesBetweenSections" />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} direction="column" pt={1}>
                    {rows.map((value, index) => (
                        <Grid item key={value.id}>
                            <EnumInput
                                options={Object.values(SWITCH_TYPE)}
                                name={`${id}.${index}.${FieldConstants.SWITCH_KIND}`}
                                label="SwitchBetweenSectionsLabel"
                                labelValues={{
                                    index1: String(index + 1),
                                    index2: String(index + 2),
                                }}
                                size="small"
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </>
    );
}

export default CreateSwitchesForm;
