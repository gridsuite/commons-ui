/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentType, FunctionComponent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Paper, useTheme } from '@mui/material';
import { AccordionIllustration } from './AccordionIllustration';

interface ReplacedText {
    eltId: string;
    tradId: string;
}

export interface GenericIllustrationNetworkModificationProps {
    svgComponent: ComponentType<any>;
    replacedTexts: ReplacedText[];
    backgroundElementId: string;
}

/**
 * This component displays a hide able explanation illustration
 */
export const GenericIllustrationNetworkModification: FunctionComponent<GenericIllustrationNetworkModificationProps> =
    function GenericIllustrationNetworkModification({
        svgComponent: SvgComponent,
        replacedTexts,
        backgroundElementId,
    }) {
        const [showDiagram, setShowDiagram] = useState(true);
        const intl = useIntl();
        const theme = useTheme();
        const isLightTheme = theme.palette.mode === 'light';

        useEffect(() => {
            // dynamically modify the text inside the svg :
            replacedTexts.forEach((replacedText) => {
                const elt = document.getElementById(replacedText.eltId);
                if (elt) {
                    elt.textContent = intl.formatMessage({
                        id: replacedText.tradId,
                    });
                }
            });
        }, [intl, replacedTexts]);

        useEffect(() => {
            /**
             * updates opacity according to the theme by updating the 'style' string from the svg element
             * @param cssProperty : String preceding and describing the property whose opacity must be changed
             * @param svgElt : element fetched from the svg that should be updated
             */
            function updateOpacity(cssProperty: string, svgElt: HTMLElement | null) {
                if (svgElt) {
                    const eltCssText = svgElt.style.cssText;
                    const indexOpacity = eltCssText.indexOf(cssProperty);
                    if (indexOpacity !== -1) {
                        // eslint-disable-next-line no-param-reassign
                        svgElt.style.cssText =
                            eltCssText.substring(0, indexOpacity + cssProperty.length) +
                            (isLightTheme ? '0' : '1') +
                            eltCssText.substring(indexOpacity + cssProperty.length + 1);
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        svgElt.style.cssText = cssProperty + (isLightTheme ? '0' : '1');
                    }
                }
            }
            updateOpacity('fill-opacity: ', document.getElementById(backgroundElementId));
        }, [backgroundElementId, isLightTheme]);

        return (
            <AccordionIllustration state={showDiagram} onClick={() => setShowDiagram((show) => !show)}>
                <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
                    <SvgComponent />
                </Paper>
            </AccordionIllustration>
        );
    };

export default GenericIllustrationNetworkModification;
