/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, array, boolean, object, string, number, TestContext } from 'yup';
import {
    OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE,
    OperationalLimitsGroup,
    OperationalLimitsGroupFormSchema,
    OperationalLimitsGroupModificationInfos,
    TemporaryLimitFormSchema,
} from './operationalLimitsGroups.types';
import {
    areArrayElementsUnique,
    AttributeModification,
    FieldConstants,
    OperationType,
    sanitizeString,
    toModificationOperation,
} from '../../../../utils';
import {
    APPLICABILITY,
    CurrentLimits,
    CurrentLimitsData,
    TEMPORARY_LIMIT_MODIFICATION_TYPE,
    TemporaryLimit,
    TemporaryLimitsData,
} from './limits.types';
import { LineModificationFormSchema } from '../../line/line-modification.types';
import { creationPropertiesSchema } from '../properties';

function hasDuplicateOperationalLimitsGroups(context: TestContext) {
    const limitsGroup: OperationalLimitsGroupFormSchema = context.parent;
    const operationalLimitsGroups: OperationalLimitsGroupFormSchema[] =
        context.from?.[1]?.value?.[FieldConstants.OPERATIONAL_LIMITS_GROUPS];
    const operationalLimitsGroupsWithPath: OperationalLimitsGroupFormSchemaWithPath[] = operationalLimitsGroups.map(
        (item, index) => {
            return {
                ...item,
                rhfPath: `${FieldConstants.LIMITS}.${FieldConstants.OPERATIONAL_LIMITS_GROUPS}[${index}]`,
            };
        }
    );

    const limitsGroupName = sanitizeString(limitsGroup[FieldConstants.NAME]);
    const filtered = operationalLimitsGroupsWithPath.filter(
        (item: OperationalLimitsGroupFormSchemaWithPath) =>
            sanitizeString(item[FieldConstants.NAME]) === limitsGroupName
    );

    if (filtered.length <= 1) {
        return true;
    }

    const applicabilityEquipment: number = filtered.filter(
        (item) => item[FieldConstants.APPLICABILITY_FIELD] === APPLICABILITY.EQUIPMENT.id
    ).length;
    const applicabilitySide1: number = filtered.filter(
        (item) => item[FieldConstants.APPLICABILITY_FIELD] === APPLICABILITY.SIDE1.id
    ).length;

    const isDuplicate =
        filtered.length > 2 || applicabilityEquipment > 0 || applicabilitySide1 === 0 || applicabilitySide1 > 1;

    return !isDuplicate;
}

function hasDuplicate(field: boolean | null | undefined, context: TestContext) {
    return hasDuplicateOperationalLimitsGroups(context);
}

const temporaryLimitsValidationSchema = () => {
    return object().shape(
        {
            [FieldConstants.TEMPORARY_LIMIT_DURATION]: number()
                .nullable()
                .min(0, 'mustBeGreaterOrEqualToZero')
                .when([FieldConstants.TEMPORARY_LIMIT_VALUE, FieldConstants.TEMPORARY_LIMIT_NAME], {
                    is: (value: number | null, name: string | null) => value != null || !!name,
                    then: (schema) => schema.required(),
                }),
            [FieldConstants.TEMPORARY_LIMIT_VALUE]: number().nullable().positive(),
            [FieldConstants.TEMPORARY_LIMIT_NAME]: string()
                .nullable()
                .trim()
                .when([FieldConstants.TEMPORARY_LIMIT_VALUE, FieldConstants.TEMPORARY_LIMIT_DURATION], {
                    is: (value: number | null, duration: number | null) => value != null || duration != null,
                    then: (schema) => schema.required(),
                }),
        },
        [[FieldConstants.TEMPORARY_LIMIT_DURATION, FieldConstants.TEMPORARY_LIMIT_NAME]]
    );
};

const currentLimitsValidationSchema = () => ({
    [FieldConstants.PERMANENT_LIMIT]: number().positive('permanentCurrentLimitMustBeGreaterThanZero').required(),
    [FieldConstants.TEMPORARY_LIMITS]: array()
        .of(temporaryLimitsValidationSchema())
        .test('distinctNames', 'TemporaryLimitNameUnicityError', (limitsArray) => {
            const namesArray = !limitsArray
                ? []
                : limitsArray
                      .filter((l) => !!l[FieldConstants.TEMPORARY_LIMIT_NAME])
                      .map((l) => sanitizeString(l[FieldConstants.TEMPORARY_LIMIT_NAME]));
            return areArrayElementsUnique(namesArray);
        })
        .test('distinctDurations', 'TemporaryLimitDurationUnicityError', (limitsArray) => {
            const durationsArray = !limitsArray
                ? []
                : limitsArray.map((l) => l[FieldConstants.TEMPORARY_LIMIT_DURATION]).filter((d) => d); // empty lines are ignored
            return areArrayElementsUnique(durationsArray);
        }),
});

const limitsPropertyValidationSchema = () => {
    return object().shape({
        [FieldConstants.NAME]: string().required(),
        [FieldConstants.VALUE]: string().required(),
    });
};

const limitsGroupValidationSchema = object()
    .shape({
        [FieldConstants.ID]: string().nonNullable().required(),
        [FieldConstants.NAME]: string().nonNullable().required(),
        [FieldConstants.APPLICABILITY_FIELD]: string().nonNullable().required(),
        [FieldConstants.OLG_IS_DUPLICATE]: boolean()
            .nullable()
            .test('testDistincts', 'LimitSetApplicabilityError', hasDuplicate),
        [FieldConstants.CURRENT_LIMITS]: object().shape(currentLimitsValidationSchema()),
        [FieldConstants.LIMITS_PROPERTIES]: array().of(limitsPropertyValidationSchema()),
    })
    .concat(creationPropertiesSchema)
    .required();

export type LimitsGroupFormData = InferType<typeof limitsGroupValidationSchema>;

interface OperationalLimitsGroupFormSchemaWithPath extends OperationalLimitsGroupFormSchema {
    rhfPath: string;
}

export const getLimitsValidationSchemaProps = (isEquipmentModification = false) =>
    object().shape({
        [FieldConstants.OPERATIONAL_LIMITS_GROUPS]: isEquipmentModification
            ? array(limitsGroupValidationSchema).when([FieldConstants.ENABLE_OLG_MODIFICATION], {
                  is: true,
                  then: (schema) => schema.required(),
                  otherwise: (schema) => schema.strip(),
              })
            : array(limitsGroupValidationSchema).required(),
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]: string().nullable(),
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]: string().nullable(),
        [FieldConstants.ENABLE_OLG_MODIFICATION]: boolean(),
    });

const limitsValidationSchemaCreation = (id: string, isModification: boolean) => {
    return { [id]: getLimitsValidationSchemaProps(isModification) };
};

export type LimitsFormSchema = InferType<
    ReturnType<typeof limitsValidationSchemaCreation>[typeof FieldConstants.LIMITS]
>;

export const getLimitsValidationSchema = (id: string = FieldConstants.LIMITS, isModification: boolean = false) => {
    return limitsValidationSchemaCreation(id, isModification);
};

export const getLimitsEmptyFormDataProps = (isModification = true) => {
    return {
        [FieldConstants.OPERATIONAL_LIMITS_GROUPS]: [],
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]: null,
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]: null,
        [FieldConstants.ENABLE_OLG_MODIFICATION]: !isModification,
    };
};

export const getLimitsEmptyFormData = (isModification = true, id = FieldConstants.LIMITS) => {
    return { [id]: getLimitsEmptyFormDataProps(isModification) };
};

export const formatTemporaryLimitsModificationToFormSchema = (
    temporaryLimits: TemporaryLimit[]
): TemporaryLimitFormSchema[] =>
    temporaryLimits?.map((limit: TemporaryLimit) => {
        return {
            [FieldConstants.TEMPORARY_LIMIT_NAME]: limit?.[FieldConstants.TEMPORARY_LIMIT_NAME]?.value ?? '',
            [FieldConstants.TEMPORARY_LIMIT_VALUE]: limit?.[FieldConstants.TEMPORARY_LIMIT_VALUE]?.value ?? null,
            [FieldConstants.TEMPORARY_LIMIT_DURATION]: limit?.[FieldConstants.TEMPORARY_LIMIT_DURATION]?.value ?? null,
        };
    });

export const formatOpLimitGroupsToFormInfos = (
    limitGroups?: OperationalLimitsGroup[] | OperationalLimitsGroupModificationInfos[] | null
): OperationalLimitsGroupFormSchema[] => {
    if (!limitGroups) {
        return [];
    }

    return limitGroups
        .filter(
            (opLimitGroup: OperationalLimitsGroup | OperationalLimitsGroupModificationInfos) =>
                opLimitGroup.modificationType !== OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.DELETE
        )
        .map((opLimitGroup: OperationalLimitsGroup | OperationalLimitsGroupModificationInfos) => {
            return {
                id: opLimitGroup.id + opLimitGroup.applicability,
                name: opLimitGroup.id,
                applicability: opLimitGroup.applicability,
                limitsProperties: opLimitGroup.limitsProperties,
                currentLimits: {
                    permanentLimit: opLimitGroup?.currentLimits?.permanentLimit,
                    temporaryLimits: formatTemporaryLimitsModificationToFormSchema(
                        opLimitGroup?.currentLimits?.temporaryLimits as TemporaryLimit[]
                    ),
                },
            };
        }) as OperationalLimitsGroupFormSchema[];
};

export const getAllLimitsFormDataProperties = (
    operationalLimitsGroups: OperationalLimitsGroupFormSchema[] = [],
    selectedOperationalLimitsGroupId1: string | null = null,
    selectedOperationalLimitsGroupId2: string | null = null,
    enableOLGModification: boolean | null = true
) => {
    return {
        [FieldConstants.OPERATIONAL_LIMITS_GROUPS]: operationalLimitsGroups,
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]: selectedOperationalLimitsGroupId1,
        [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]: selectedOperationalLimitsGroupId2,
        [FieldConstants.ENABLE_OLG_MODIFICATION]: !!enableOLGModification,
    };
};

export const getAllLimitsFormData = (
    operationalLimitsGroups: OperationalLimitsGroupFormSchema[] = [],
    selectedOperationalLimitsGroupId1: string | null = null,
    selectedOperationalLimitsGroupId2: string | null = null,
    enableOLGModification: boolean | null = true,
    id = FieldConstants.LIMITS
) => {
    return {
        [id]: getAllLimitsFormDataProperties(
            operationalLimitsGroups,
            selectedOperationalLimitsGroupId1,
            selectedOperationalLimitsGroupId2,
            enableOLGModification
        ),
    };
};

/**
 * sanitizes limit names and filters out the empty temporary limits lines
 */
export const sanitizeLimitsGroups = (limitsGroups: LimitsGroupFormData[] = []): OperationalLimitsGroupFormSchema[] =>
    (limitsGroups || []).map(({ currentLimits, [FieldConstants.OLG_IS_DUPLICATE]: isDuplicate, ...baseData }) => ({
        ...baseData,
        [FieldConstants.OLG_IS_DUPLICATE]: isDuplicate ?? undefined,
        id: baseData.name,
        currentLimits: !currentLimits
            ? {
                  id: '',
                  permanentLimit: 0,
                  temporaryLimits: [],
              }
            : {
                  permanentLimit: currentLimits.permanentLimit,
                  temporaryLimits: !currentLimits.temporaryLimits
                      ? []
                      : currentLimits.temporaryLimits
                            // completely empty lines should be filtered out (the interface always displays some lines even if empty)
                            .filter((limit) => limit?.name?.trim())
                            .map(({ name, ...temporaryLimit }) => ({
                                ...temporaryLimit,
                                name: sanitizeString(name) ?? '',
                            })),
              },
    }));

export const sanitizeLimitNames = (temporaryLimitList: TemporaryLimitFormSchema[]): TemporaryLimitFormSchema[] =>
    temporaryLimitList
        ?.filter((limit: TemporaryLimitFormSchema) => limit?.name?.trim())
        .map(({ name, ...temporaryLimit }) => ({
            ...temporaryLimit,
            name: sanitizeString(name) ?? '',
        })) || [];

export const formatMapInfosToTemporaryLimitsFormSchema = (
    temporaryLimits: TemporaryLimitsData[]
): TemporaryLimitFormSchema[] =>
    temporaryLimits?.map((limit: TemporaryLimitsData) => {
        return {
            [FieldConstants.TEMPORARY_LIMIT_NAME]: limit?.[FieldConstants.TEMPORARY_LIMIT_NAME] ?? '',
            [FieldConstants.TEMPORARY_LIMIT_VALUE]: limit?.[FieldConstants.TEMPORARY_LIMIT_VALUE] ?? null,
            [FieldConstants.TEMPORARY_LIMIT_DURATION]: limit?.[FieldConstants.TEMPORARY_LIMIT_DURATION] ?? null,
        };
    });

export const mapServerLimitsGroupsToFormInfos = (currentLimits: CurrentLimitsData[]) => {
    return currentLimits?.map((currentLimit: CurrentLimitsData) => {
        return {
            id: currentLimit.id + currentLimit.applicability,
            name: currentLimit.id,
            applicability: currentLimit.applicability,
            limitsProperties: currentLimit.limitsProperties,
            currentLimits: {
                id: currentLimit.id,
                permanentLimit: currentLimit.permanentLimit,
                temporaryLimits: formatMapInfosToTemporaryLimitsFormSchema(currentLimit.temporaryLimits),
            },
        };
    });
};

export const convertToOperationalLimitsGroupFormSchema = (
    currentLimits: CurrentLimitsData[]
): OperationalLimitsGroupFormSchema[] => {
    const updatedOpLG: OperationalLimitsGroupFormSchema[] = [];

    for (const currentLimit of currentLimits) {
        const equivalentFromNetMod = updatedOpLG.find(
            (opLG: OperationalLimitsGroupFormSchema) =>
                currentLimit.id === opLG.name && currentLimit.applicability === opLG[FieldConstants.APPLICABILITY_FIELD]
        );
        if (equivalentFromNetMod === undefined) {
            updatedOpLG.push({
                id: currentLimit.id + currentLimit.applicability,
                name: currentLimit.id,
                applicability: currentLimit.applicability,
                limitsProperties: currentLimit.limitsProperties,
                currentLimits: {
                    permanentLimit: currentLimit.permanentLimit ?? 0,
                    temporaryLimits: formatMapInfosToTemporaryLimitsFormSchema(currentLimit.temporaryLimits),
                },
            });
        }
    }

    return updatedOpLG;
};

export const getOpLimitsGroupInfosFromBranchModification = (
    formBranchModification: LineModificationFormSchema
): OperationalLimitsGroupFormSchema[] => {
    return formBranchModification?.limits?.operationalLimitsGroups ?? [];
};
export const addModificationTypeToTemporaryLimits = (
    formTemporaryLimits: TemporaryLimitFormSchema[]
): TemporaryLimit[] => {
    return formTemporaryLimits.map((limit: TemporaryLimitFormSchema) => {
        return {
            name: toModificationOperation(limit?.name),
            acceptableDuration: toModificationOperation(limit?.acceptableDuration),
            value: toModificationOperation(limit?.value),
            modificationType: TEMPORARY_LIMIT_MODIFICATION_TYPE.MODIFY_OR_ADD,
        };
    });
};

export function addOperationTypeToSelectedOpLG(
    selectedOpLG: string | null | undefined,
    noSelectionString: string
): AttributeModification<string> | null {
    return selectedOpLG === noSelectionString
        ? {
              value: selectedOpLG,
              op: OperationType.UNSET,
          }
        : toModificationOperation(selectedOpLG);
}

/**
 * converts the limits groups into a modification limits group
 * ie mostly add the ADD, MODIFY, MODIFY_OR_ADD, DELETE and REPLACE tags to the data using a delta between the form and the network values
 * note : for now only MODIFY_OR_ADD is handled, the others have been disabled for various reasons
 *
 * @param limitsGroupsForm current data from the form
 */
export const addModificationTypeToOpLimitsGroups = (
    limitsGroupsForm: OperationalLimitsGroupFormSchema[]
): OperationalLimitsGroup[] => {
    const modificationLimitsGroupsForm: OperationalLimitsGroupFormSchema[] = sanitizeLimitsGroups(limitsGroupsForm);

    return modificationLimitsGroupsForm.map((limitsGroupForm: OperationalLimitsGroupFormSchema) => {
        const temporaryLimits: TemporaryLimit[] = addModificationTypeToTemporaryLimits(
            sanitizeLimitNames(limitsGroupForm[FieldConstants.CURRENT_LIMITS]?.[FieldConstants.TEMPORARY_LIMITS])
        );
        const currentLimits: CurrentLimits = {
            permanentLimit: limitsGroupForm[FieldConstants.CURRENT_LIMITS]?.[FieldConstants.PERMANENT_LIMIT] ?? null,
            temporaryLimits: temporaryLimits ?? [],
        };

        return {
            id: limitsGroupForm.id,
            name: limitsGroupForm.name,
            applicability: limitsGroupForm.applicability,
            limitsProperties: limitsGroupForm.limitsProperties,
            currentLimits,
            modificationType: OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.MODIFY_OR_ADD,
            temporaryLimitsModificationType: TEMPORARY_LIMIT_MODIFICATION_TYPE.REPLACE,
        };
    });
};
