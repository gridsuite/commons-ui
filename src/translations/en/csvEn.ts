/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const csvEn = defineMessages({
    ImportCSV: { defaultMessage: 'Import CSV' },
    noDataInCsvFile: { defaultMessage: 'No data found in this file' },
    wrongCsvHeadersError: {
        defaultMessage:
            'This CSV file has the wrong headers. Use Generate CSV Skeleton button to get supported CSV format',
    },
    keepCSVDataMessage: { defaultMessage: 'Do you want to replace or add the new data to the current list?' },
    GenerateCSV: { defaultMessage: 'Generate CSV skeleton' },
    UploadCSV: { defaultMessage: 'Upload CSV' },
    uploadMessage: { defaultMessage: 'No file selected' },
});
