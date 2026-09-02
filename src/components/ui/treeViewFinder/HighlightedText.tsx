/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import cyrb53 from '../../../utils/cyrb53';

//
// Copied from gridExplore
//
export interface HighlightedTextProps {
    text: string;
    highlight: string;
}

export function HighlightedText({ text, highlight }: Readonly<HighlightedTextProps>) {
    const escapedHighlight = useMemo(() => highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), [highlight]);
    const parts = useMemo<[string, number][]>(
        () => text.split(new RegExp(`(${escapedHighlight})`, 'gi')).map((part) => [part, cyrb53(part)]),
        [escapedHighlight, text]
    );
    return (
        <span>
            {parts.map(([part, hashCode]) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={`part-${hashCode}`} style={{ fontWeight: 'bold' }}>
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </span>
    );
}
