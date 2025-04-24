/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ColDef, GridOptions } from 'ag-grid-community';
import { CustomAGGrid } from '../customAggrid';
import { RenderBuilder } from '../../../tests/testsUtils.test';

const RenderBuilderInstance = new RenderBuilder().withTrad().withTheme();

const defaultColDef: ColDef = { flex: 1 };

const columnDefs: ColDef[] = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' },
];

const rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 },
];

const gridOptions: GridOptions = {
    defaultColDef,
    columnDefs,
    rowData,
};

describe('CustomAGGrid', () => {
    // eslint-disable-next-line jest/expect-expect
    it('renders without crashing', () => {
        RenderBuilderInstance.render(<CustomAGGrid gridOptions={gridOptions} />);
    });
});
