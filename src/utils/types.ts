/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'crypto';
import { ElementType } from './ElementType';
import {
    Battery,
    BusBar,
    DanglingLine,
    Generator,
    Hvdc,
    LCC,
    Line,
    Load,
    ShuntCompensator,
    Substation,
    SVC,
    ThreeWindingTransfo,
    TwoWindingTransfo,
    VoltageLevel,
    VSC,
} from './equipment-types';

export type Input = string | number;

export type ElementAttributes = {
    elementUuid: UUID;
    elementName: string;
    description: string;
    type: ElementType;
    accessRights: {
        isPrivate: boolean;
    };
    owner: string;
    subdirectoriesCount: number;
    creationDate: string;
    lastModificationDate: string;
    lastModifiedBy: string;
    children: any[];
    parentUuid: null | UUID;
    specificMetadata: Record<string, object>;
    uploading?: boolean;
};

export type Equipment =
    | typeof Substation
    | typeof Line
    | typeof Generator
    | typeof Load
    | typeof Battery
    | typeof SVC
    | typeof DanglingLine
    | typeof LCC
    | typeof VSC
    | typeof Hvdc
    | typeof BusBar
    | typeof TwoWindingTransfo
    | typeof ThreeWindingTransfo
    | typeof ShuntCompensator
    | typeof VoltageLevel;

export type EquipmentType = {
    [Type in Equipment['type']]: Type;
}[Equipment['type']];

export type Option =
    | {
          id: string;
          label: string;
      }
    | string;

export type PredefinedProperties = {
    [propertyName: string]: string[];
};
