/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';

// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';

/**
 * This is a modified version of the cell editor proposed by AGGrid itself :
 * https://www.ag-grid.com/javascript-data-grid/component-cell-editor/#cell-editor-example
 * I use this JS version instead of the React version because it's simpler and lighter.
 * React version if you want to check, with forwardRef, useEffect and useImperativeHandle :
 * https://www.ag-grid.com/react-data-grid/component-cell-editor/#cell-editor-example
 */
class NumericEditor implements ICellEditorComp {
    eInput!: HTMLInputElement;

    cancelBeforeStart!: boolean;

    // gets called once before the renderer is used
    init(params: ICellEditorParams) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.classList.add('numeric-input');

        if (params.eventKey === KEY_BACKSPACE) {
            this.eInput.value = '';
        } else if (NumericEditor.isCharNumeric(params.eventKey)) {
            this.eInput.value = params.eventKey!;
        } else if (params.value !== undefined && params.value !== null) {
            this.eInput.value = params.value;
        }

        this.eInput.addEventListener('keydown', (event) => {
            if (!event.key || event.key.length !== 1) {
                return;
            }
            if (!NumericEditor.isNumericKey(event)) {
                this.eInput.focus();
                if (event.preventDefault) {
                    event.preventDefault();
                }
            } else if (NumericEditor.isNavigationKey(event) || NumericEditor.isBackspace(event)) {
                event.stopPropagation();
            }
        });

        // only start edit if key pressed is a number, not a letter
        // FM : I added ',' and '.'
        const isNotANumber =
            params.eventKey && params.eventKey.length === 1 && '1234567890,.'.indexOf(params.eventKey) < 0;
        this.cancelBeforeStart = !!isNotANumber;
    }

    static isBackspace(event: any) {
        return event.key === KEY_BACKSPACE;
    }

    static isNavigationKey(event: any) {
        return event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    }

    // gets called once when grid ready to insert the element
    getGui() {
        return this.eInput;
    }

    // focus and select can be done after the gui is attached
    afterGuiAttached() {
        this.eInput.focus();
    }

    // returns the new value after editing
    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }

    // returns the new value after editing
    getValue() {
        const { value } = this.eInput;
        // FM : some modifications here
        const tmp = value?.replace(',', '.') || '';
        return parseFloat(tmp) || null;
    }

    static isCharNumeric(charStr: string | null) {
        // FM : I added ',' and '.'
        return charStr && !!/\d|,|\./.test(charStr);
    }

    static isNumericKey(event: any) {
        const charStr = event.key;
        return NumericEditor.isCharNumeric(charStr);
    }

    // force call when focus is leaving the editor
    static focusOut() {
        return true;
    }
}

export default NumericEditor;
