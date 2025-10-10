/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { ElementType } from './elementType';

export type Input = string | number;

export type ElementAttributes = {
    elementUuid: UUID;
    elementName: string;
    description: string;
    type: ElementType;
    accessRights: {
        isPrivate: boolean;
    };
    owner: string; // id
    ownerLabel?: string; // enrich with user identity server
    subdirectoriesCount: number;
    creationDate: string;
    lastModificationDate: string;
    lastModifiedBy: string; // id
    lastModifiedByLabel?: string; // enrich with user identity server
    children: ElementAttributes[];
    parentUuid: null | UUID;
    specificMetadata: {
        type: string;
        equipmentType: string;
        sheetType?: string;
        format?: string;
    };
    uploading?: boolean;
    hasMetadata?: boolean;
    subtype?: string;
    // only uploading element have this field
    id?: string;
};

export type Option =
    | {
          id: string;
          label: string;
      }
    | string;

export type PredefinedProperties = {
    [propertyName: string]: string[];
};

export type UserDetail = {
    sub: string;
    isAdmin: boolean;
    profileName?: string;
    maxAllowedCases: number;
    numberCasesUsed: number;
    maxAllowedBuilds: number;
};

export enum AnnouncementSeverity {
    INFO = 'INFO',
    WARN = 'WARN',
}

export type AnnouncementDto = {
    id: UUID;
    startDate: Date;
    endDate: Date;
    message: string;
    severity: AnnouncementSeverity;
    remainingDuration: number;
};

export enum ArrayAction {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
}
