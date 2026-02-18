/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PredefinedProperties } from './types';

type MetaDataRessources = {
    types: string[];
    path: string;
};
export type Metadata = {
    name: string;
    url: string | URL;
    appColor: string;
    hiddenInAppsMenu: boolean;
    hiddenUserInformation: boolean;
    resources?: MetaDataRessources[];
};

export type StudyMetadata = Metadata & {
    name: 'Study';
    predefinedEquipmentProperties?: {
        [networkElementType: string]: PredefinedProperties;
    };
    defaultParametersValues?: {
        isDeveloperMode?: boolean;
    };
    defaultCountry?: string;
    favoriteCountries?: string[];
    substationPropertiesGlobalFilters?: Map<string, string[]>; // used to generate user specific global filters
    baseMapOptions?: { id: string; label: string }[];
    temporaryLimitsNamesForCatalog?: string[];
};

export type ExploreMetadata = Metadata & {
    name: 'Explore';
    maxFileSizeInMb?: number;
};

type ThemeColors = Record<string, string>;
type SldAndNadColors = {
    darkThemeColors: ThemeColors;
    lightThemeColors: ThemeColors;
};

export type BaseVoltageConfig = {
    // used when calling powsybl server
    name: string;
    minValue: number;
    maxValue: number;
};
export type BaseVoltage = BaseVoltageConfig & {
    // used to define the voltage ranges and their colors
    networkMapColor: string;
    sldAndNadColors: SldAndNadColors;
};
