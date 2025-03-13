/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createPart, type Part } from 'ag-grid-community';
import cssBase from './base.css?inline';
import cssNoBorderRight from './noBorderRight.css?inline';
import csshidePinnedHeaderRightBorder from './hidePinnedHeaderRightBorder.css?inline';

type ExtractPartParams<TPart extends Part<any>> = TPart extends Part<infer TParams> ? TParams : never;

export const baseGridSuite = createPart({
    feature: 'gridsuite',
    css: cssBase,
});

export const noBorderRight = createPart({
    feature: 'noBorderRight',
    css: cssNoBorderRight,
});

export const hidePinnedHeaderRightBorder = createPart({
    feature: 'hidePinnedHeaderRightBorder',
    params: {
        loadingBackgroundColor: { ref: 'backgroundColor', mix: 0.5 },
    },
    css: csshidePinnedHeaderRightBorder,
});
export type HidePinnedHeaderRightBorderParams = ExtractPartParams<typeof hidePinnedHeaderRightBorder>;
