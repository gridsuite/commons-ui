/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, array, number, object, string } from 'yup';
import { CurrentLimitsInfo } from './lineCatalog.type';
import { APPLICABILITY } from '../../common/currentLimits/limits.types';
import {
    OperationalLimitsGroupFormSchema,
    TemporaryLimitFormSchema,
} from '../../common/currentLimits/operationalLimitsGroups/operationalLimitsGroups.types';
import { LineSegmentInfos } from '../common/line.types';
import { FieldConstants } from '../../../../utils';

export const SegmentTemporaryLimitSchema = object().shape({
    [FieldConstants.LIMIT_VALUE]: number().required(),
    [FieldConstants.TEMPORARY_LIMIT_DURATION]: number().required(),
    [FieldConstants.TEMPORARY_LIMIT_NAME]: string().required(),
});

export const SegmentCurrentLimitsSchema = object().shape({
    [FieldConstants.LIMIT_SET_NAME]: string().required(),
    [FieldConstants.PERMANENT_LIMIT]: number().required(),
    [FieldConstants.TEMPORARY_LIMITS]: array().of(SegmentTemporaryLimitSchema).nullable(),
});

// used by LineCreation schema
export const SegmentInfoSchema = object().shape({
    [FieldConstants.SEGMENT_TYPE_ID]: string().required(),
    [FieldConstants.SEGMENT_DISTANCE_VALUE]: number()
        .required('SegmentDistanceMustBeGreaterThanZero')
        .moreThan(0, 'SegmentDistanceMustBeGreaterThanZero'),
    [FieldConstants.AREA]: string().nullable().default(null),
    [FieldConstants.TEMPERATURE]: string().nullable().default(null),
    [FieldConstants.SHAPE_FACTOR]: number().nullable().default(null),
});
export type SegmentInfoFormData = InferType<typeof SegmentInfoSchema>;
export const LineSegmentsInfoSchema = array().of(SegmentInfoSchema);
export type LineSegmentsFormData = InferType<typeof LineSegmentsInfoSchema>;

// used by Catalog schema
export const SegmentSchema = object()
    .shape({
        [FieldConstants.SEGMENT_TYPE_VALUE]: string()
            .required()
            .test('empty-check', 'SegmentTypeMissing', (value) => (value ? value.length > 0 : false)),
        [FieldConstants.SEGMENT_RESISTANCE]: number().required(),
        [FieldConstants.SEGMENT_REACTANCE]: number().required(),
        [FieldConstants.SEGMENT_SUSCEPTANCE]: number().required(),
        [FieldConstants.SEGMENT_CURRENT_LIMITS]: array().of(SegmentCurrentLimitsSchema),
    })
    .concat(SegmentInfoSchema);

export type SegmentFormData = InferType<typeof SegmentSchema>;

export interface SegmentsFormData {
    [FieldConstants.LINE_SEGMENTS]: LineSegmentsFormData;
    [FieldConstants.APPLY_SEGMENTS_LIMITS]?: boolean;
}

export const emptyLineSegment: SegmentFormData = {
    [FieldConstants.SEGMENT_DISTANCE_VALUE]: 0,
    [FieldConstants.SEGMENT_TYPE_VALUE]: '',
    [FieldConstants.SEGMENT_TYPE_ID]: '',
    [FieldConstants.AREA]: null,
    [FieldConstants.TEMPERATURE]: null,
    [FieldConstants.SHAPE_FACTOR]: null,
    [FieldConstants.SEGMENT_RESISTANCE]: 0,
    [FieldConstants.SEGMENT_REACTANCE]: 0,
    [FieldConstants.SEGMENT_SUSCEPTANCE]: 0,
    [FieldConstants.SEGMENT_CURRENT_LIMITS]: [],
};

export function convertToLineSegmentInfos(lineSegments: LineSegmentsFormData): LineSegmentInfos[] {
    return (
        lineSegments
            ?.filter(
                (segment): segment is SegmentFormData =>
                    segment != null && segment[FieldConstants.SEGMENT_TYPE_ID] !== null
            )
            .map((segment) => ({
                [FieldConstants.SEGMENT_TYPE_ID]: segment[FieldConstants.SEGMENT_TYPE_ID],
                [FieldConstants.SEGMENT_DISTANCE_VALUE]: segment[FieldConstants.SEGMENT_DISTANCE_VALUE],
                [FieldConstants.AREA]: segment[FieldConstants.AREA],
                [FieldConstants.TEMPERATURE]: segment[FieldConstants.TEMPERATURE] ?? '',
                [FieldConstants.SHAPE_FACTOR]: segment[FieldConstants.SHAPE_FACTOR],
            })) ?? []
    );
}

export function convertToLineSegmentsFormData(lineSegmentInfos: LineSegmentInfos[] | undefined): LineSegmentsFormData {
    return (
        lineSegmentInfos?.map((info) => ({
            ...emptyLineSegment,
            [FieldConstants.SEGMENT_TYPE_ID]: info[FieldConstants.SEGMENT_TYPE_ID],
            [FieldConstants.SEGMENT_DISTANCE_VALUE]: info[FieldConstants.SEGMENT_DISTANCE_VALUE],
            [FieldConstants.AREA]: info[FieldConstants.AREA] ?? null,
            [FieldConstants.TEMPERATURE]:
                info[FieldConstants.TEMPERATURE] === '' ? null : info[FieldConstants.TEMPERATURE],
            [FieldConstants.SHAPE_FACTOR]: info[FieldConstants.SHAPE_FACTOR] ?? null,
        })) ?? []
    );
}

export function convertLimitsToOperationalLimitsGroupFormSchema(limitSets: CurrentLimitsInfo[]) {
    const finalLimitSets: OperationalLimitsGroupFormSchema[] = [];
    limitSets.forEach((limitSet: CurrentLimitsInfo) => {
        const temporaryLimitsList: TemporaryLimitFormSchema[] = [];
        limitSet.temporaryLimits?.forEach((temporaryLimit) => {
            temporaryLimitsList.push({
                name: temporaryLimit.name,
                acceptableDuration: temporaryLimit.acceptableDuration,
                value: temporaryLimit.limitValue,
            });
        });
        finalLimitSets.push({
            id: limitSet.limitSetName + APPLICABILITY.EQUIPMENT.id,
            name: limitSet.limitSetName,
            applicability: APPLICABILITY.EQUIPMENT.id,
            currentLimits: {
                id: limitSet.limitSetName,
                permanentLimit: limitSet.permanentLimit,
                temporaryLimits: temporaryLimitsList,
            },
        });
    });
    return finalLimitSets;
}
