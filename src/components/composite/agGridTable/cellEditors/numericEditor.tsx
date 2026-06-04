/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { type CustomCellEditorProps } from 'ag-grid-react';
import { KeyCode, type SuppressKeyboardEventParams } from 'ag-grid-community';

const isCharNumeric = (charStr: string | null | undefined) => !!charStr && /\d|,|\./.test(charStr);

/**
 * `suppressKeyboardEvent` callback to put on any column using {@link NumericEditor}.
 * Prevents ag-grid from starting an edit when a non-numeric printable key is pressed on a focused cell.
 * Numeric keys still start editing; keys pressed while already editing are left to the input's own onKeyDown handling.
 */
export const suppressNonNumericKeyboardEvent = (params: SuppressKeyboardEventParams) =>
    !params.editing && params.event.key.length === 1 && !isCharNumeric(params.event.key);

// commit the value as a number, accepting "," as a decimal separator (null when empty/invalid)
const toNumber = (text: string) => {
    const result = Number.parseFloat(text.replace(',', '.'));
    return Number.isNaN(result) ? null : result;
};

/**
 * Custom numeric cell editor (see ag-grid custom cell editor docs:
 * https://www.ag-grid.com/react-data-grid/cell-editors/#custom-components).
 * Restricts typing to digits and decimal separators while keeping the raw text in the input,
 * and commits the value as a number (or null) via onValueChange.
 *
 * NB: the `eventKey`-driven logic below (seeding the initial value from the triggering key in the
 * useState/useEffect) only matters when editing is started by typing a character on a focused cell,
 * i.e. when the column uses `singleClickEdit: false`. With `singleClickEdit: true` (what we mostly
 * use), editing starts on click, `eventKey` is null, and those branches are effectively inert.
 *
 * Columns using this editor should also set `suppressKeyboardEvent: suppressNonNumericKeyboardEvent`
 * so that a non-numeric key on a focused cell doesn't start an edit.
 */
export function NumericEditor({ value, onValueChange, eventKey }: CustomCellEditorProps) {
    const refInput = useRef<HTMLInputElement>(null);

    // raw text shown in the input (kept as a string so "," and partial decimals stay typeable)
    const [text, setText] = useState<string>(() => {
        if (eventKey === KeyCode.BACKSPACE) {
            return '';
        }
        if (eventKey?.length === 1 && isCharNumeric(eventKey)) {
            return eventKey;
        }
        return value == null ? '' : String(value);
    });

    useEffect(() => {
        // Seed the grid editor value on mount: ag-grid keeps the last value passed to
        // onValueChange, and a character that triggered editing (eventKey) does not fire the
        // input's onChange — without this the typed character would be lost on immediate commit.
        onValueChange(toNumber(text));
        refInput.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event: { target: HTMLInputElement }) => {
        setText(event.target.value);
        onValueChange(toNumber(event.target.value));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // block single non-numeric characters, let everything else through (navigation, backspace…)
        if (event.key.length === 1 && !isCharNumeric(event.key)) {
            event.preventDefault();
        }
    };

    // Reproduce ag-grid's built-in text editor DOM/classes so this editor inherits the exact same
    // theme styling (the `.ag-cell-inline-editing .ag-cell-editor … input` and `.ag-input-field-input` rules).
    return (
        <div className="ag-cell-editor ag-text-field ag-input-field" role="presentation">
            <div className="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper" role="presentation">
                <input
                    ref={refInput}
                    className="ag-input-field-input ag-text-field-input"
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}
