/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const csvFr = defineMessages({
    ImportCSV: { defaultMessage: 'Import CSV' },
    noDataInCsvFile: { defaultMessage: 'Aucune donnée trouvée dans ce fichier' },
    wrongCsvHeadersError: {
        defaultMessage:
            'Les en-têtes du fichier CSV sont incorrects. Utilisez le bouton Générer le squelette CSV pour obtenir le format CSV pris en charge',
    },
    keepCSVDataMessage: {
        defaultMessage: 'Voulez-vous remplacer la liste existante ou y ajouter les nouvelles données ?',
    },
    GenerateCSV: { defaultMessage: 'Générer le squelette CSV' },
    UploadCSV: { defaultMessage: 'Télécharger le CSV' },
    uploadMessage: { defaultMessage: ' Aucun fichier sélectionné' },
});
