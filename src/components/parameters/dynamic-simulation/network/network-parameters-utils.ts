/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Network } from './network-parameters-constants';
import yup from '../../../../utils/yupConfig';

export const networkFormSchema = yup.object().shape({
    [Network.CAPACITOR_NO_RECLOSING_DELAY]: yup.number().required(),
    [Network.DANGLING_LINE_CURRENT_LIMIT_MAX_TIME_OPERATION]: yup.number().required(),
    [Network.LINE_CURRENT_LIMIT_MAX_TIME_OPERATION]: yup.number().required(),
    [Network.LOAD_TP]: yup.number().required(),
    [Network.LOAD_TQ]: yup.number().required(),
    [Network.LOAD_ALPHA]: yup.number().required(),
    [Network.LOAD_ALPHA_LONG]: yup.number().required(),
    [Network.LOAD_BETA]: yup.number().required(),
    [Network.LOAD_BETA_LONG]: yup.number().required(),
    [Network.LOAD_IS_CONTROLLABLE]: yup.boolean(),
    [Network.LOAD_IS_RESTORATIVE]: yup.boolean(),
    [Network.LOAD_Z_PMAX]: yup.number().required(),
    [Network.LOAD_Z_QMAX]: yup.number().required(),
    [Network.REACTANCE_NO_RECLOSING_DELAY]: yup.number().required(),
    [Network.TRANSFORMER_CURRENT_LIMIT_MAX_TIME_OPERATION]: yup.number().required(),
    [Network.TRANSFORMER_T1_ST_HT]: yup.number().required(),
    [Network.TRANSFORMER_T1_ST_THT]: yup.number().required(),
    [Network.TRANSFORMER_T_NEXT_HT]: yup.number().required(),
    [Network.TRANSFORMER_T_NEXT_THT]: yup.number().required(),
    [Network.TRANSFORMER_TO_LV]: yup.number().required(),
});

export const networkEmptyFormData = {
    [Network.CAPACITOR_NO_RECLOSING_DELAY]: 0,
    [Network.DANGLING_LINE_CURRENT_LIMIT_MAX_TIME_OPERATION]: 0,
    [Network.LINE_CURRENT_LIMIT_MAX_TIME_OPERATION]: 0,
    [Network.LOAD_TP]: 0,
    [Network.LOAD_TQ]: 0,
    [Network.LOAD_ALPHA]: 0,
    [Network.LOAD_ALPHA_LONG]: 0,
    [Network.LOAD_BETA]: 0,
    [Network.LOAD_BETA_LONG]: 0,
    [Network.LOAD_IS_CONTROLLABLE]: false,
    [Network.LOAD_IS_RESTORATIVE]: false,
    [Network.LOAD_Z_PMAX]: 0,
    [Network.LOAD_Z_QMAX]: 0,
    [Network.REACTANCE_NO_RECLOSING_DELAY]: 0,
    [Network.TRANSFORMER_CURRENT_LIMIT_MAX_TIME_OPERATION]: 0,
    [Network.TRANSFORMER_T1_ST_HT]: 0,
    [Network.TRANSFORMER_T1_ST_THT]: 0,
    [Network.TRANSFORMER_T_NEXT_HT]: 0,
    [Network.TRANSFORMER_T_NEXT_THT]: 0,
    [Network.TRANSFORMER_TO_LV]: 0,
};
