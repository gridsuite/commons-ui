/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ICellEditorComp, type ICellEditorParams, KeyCode } from 'ag-grid-community';

/**
 * This is a modified version of the cell editor proposed by AGGrid itself :
 * https://www.ag-grid.com/javascript-data-grid/component-cell-editor/#cell-editor-example
 * I use this JS version instead of the React version because it's simpler and lighter.
 * React version if you want to check, with forwardRef, useEffect and useImperativeHandle :
 * https://www.ag-grid.com/react-data-grid/component-cell-editor/#cell-editor-example
 */
export class NumericEditor implements ICellEditorComp {
    private eInput!: HTMLInputElement;

    private cancelBeforeStart!: boolean;

    // gets called once before the renderer is used
    init(params: ICellEditorParams) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.classList.add('numeric-input');

        // backspace starts the editor on Windows
        if (params.eventKey === KeyCode.BACKSPACE) {
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

    private static isBackspace(event: KeyboardEvent) {
        return event.key === KeyCode.BACKSPACE;
    }

    private static isNavigationKey(event: KeyboardEvent) {
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
        // FM : some modifications here
        const result = parseFloat(this.eInput.value.replace(',', '.'));
        return Number.isNaN(result) ? null : result;
    }

    private static isCharNumeric(charStr: string | null) {
        // FM : I added ',' and '.'
        return charStr && /\d|,|\./.test(charStr);
    }

    private static isNumericKey(event: KeyboardEvent) {
        return NumericEditor.isCharNumeric(event.key);
    }
}
