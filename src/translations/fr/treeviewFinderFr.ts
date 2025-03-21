/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { defineMessages } from '../utils';

export const treeviewFinderFr = defineMessages({
    'treeview_finder/close': { defaultMessage: 'Fermer' },
    'treeview_finder/validate': { defaultMessage: 'Valider' },
    'treeview_finder/add': { defaultMessage: 'Ajouter...' },
    'treeview_finder/deleteSelection': { defaultMessage: 'Supprimer la selection' },
    'treeview_finder/contentText': {
        defaultMessage:
            '{multiSelect, select, true {Veuillez choisir un ou plusieurs éléments.} false {Veuillez choisir un élément.} other {}}',
    },
    'treeview_finder/finderTitle': {
        defaultMessage:
            '{multiSelect, select, true {Veuillez choisir un ou plusieurs éléments.} false {Veuillez choisir un élément.} other {}}',
    },
    'treeview_finder/addElementsValidation': {
        defaultMessage:
            '{nbElements, plural, zero {Veuillez sélectionner un élément} one {Ajouter cet élément} other {Ajouter # éléments}}',
    },
    'treeview_finder/replaceElementsValidation': {
        defaultMessage:
            '{nbElements, plural, zero {Veuillez sélectionner un élément} one {Remplacer par cet élément} other {Remplacer par # éléments}}',
    },
});
