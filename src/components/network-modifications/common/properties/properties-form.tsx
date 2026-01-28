/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { fetchPredefinedProperties, initializedProperty } from './property-utils';
import { PropertyForm } from './property-form';
import GridSection from '../../../grid/grid-section';
import { FieldConstants, PredefinedProperties } from '../../../../utils';
import { ExpandableInput } from '../../../inputs';

type PropertiesFormProps = {
    id?: string;
    networkElementType?: string;
    isModification?: boolean;
};

export function PropertiesForm({ id, networkElementType, isModification = false }: Readonly<PropertiesFormProps>) {
    const additionalProperties = id
        ? `${id}.${FieldConstants.ADDITIONAL_PROPERTIES}`
        : FieldConstants.ADDITIONAL_PROPERTIES;
    const watchProps = useWatch({
        name: additionalProperties,
    });
    const { getValues, setValue } = useFormContext();
    const [predefinedProperties, setPredefinedProperties] = useState<PredefinedProperties>({});

    useEffect(() => {
        if (networkElementType) {
            fetchPredefinedProperties(networkElementType).then((res) => {
                if (res) {
                    setPredefinedProperties(res);
                }
            });
        }
    }, [networkElementType]);

    const getDeletionMark = useCallback(
        (idx: number) => {
            const properties = getValues(`${additionalProperties}`);
            if (properties && typeof properties[idx] !== 'undefined') {
                return watchProps && properties[idx][FieldConstants.DELETION_MARK];
            }
            return false;
        },
        [getValues, watchProps, additionalProperties]
    );

    const deleteCallback = useCallback(
        (idx: number) => {
            let markedForDeletion = false;
            const properties = getValues(`${additionalProperties}`);
            if (properties && typeof properties[idx] !== 'undefined') {
                markedForDeletion = properties[idx][FieldConstants.DELETION_MARK];
            } else {
                return false;
            }

            let canRemoveLine = true;
            if (markedForDeletion) {
                // just unmark
                setValue(`${additionalProperties}.${idx}.${FieldConstants.DELETION_MARK}`, false, {
                    shouldDirty: true,
                });
                canRemoveLine = false;
            } else if (
                properties[idx][FieldConstants.PREVIOUS_VALUE] &&
                properties[idx][FieldConstants.ADDED] === false
            ) {
                // we should mark for deletion a property that actually exists in the network and not delete the property line straight away
                setValue(`${additionalProperties}.${idx}.${FieldConstants.DELETION_MARK}`, true, {
                    shouldDirty: true,
                });
                canRemoveLine = false;
            }
            // otherwise just delete the line
            return canRemoveLine;
        },
        [getValues, setValue, additionalProperties]
    );

    const modificationProperties = isModification
        ? {
              getDeletionMark,
              deleteCallback,
              watchProps,
          }
        : {};

    const additionalProps = (
        <ExpandableInput
            name={additionalProperties}
            Field={PropertyForm}
            fieldProps={{ predefinedProperties }}
            addButtonLabel="AddProperty"
            initialValue={initializedProperty()}
            {...modificationProperties}
        />
    );

    return (
        <Grid container>
            <GridSection title="AdditionalInformation" />
            {additionalProps}
        </Grid>
    );
}
