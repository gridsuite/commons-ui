/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { SCAFaultResult, SCAFeederResult, ShortCircuitAnalysisType } from './shortcircuit-analysis-result.type';
import { IShortCircuitAnalysisGlobalResultProps, ShortCircuitAnalysisResult } from './shortcircuit-analysis-result';

export interface ShortCircuitAnalysisAllBusesResultProps extends Omit<
    IShortCircuitAnalysisGlobalResultProps,
    'analysisType' | 'result' | 'updateResult' | 'customTablePaginationProps'
> {}

export function ShortCircuitAnalysisAllBusesResult(props: ShortCircuitAnalysisAllBusesResultProps) {
    const [result, setResult] = useState<SCAFaultResult[] | undefined>(undefined);

    const updateResult = useCallback((results: SCAFaultResult[] | SCAFeederResult[] | null) => {
        setResult((results as SCAFaultResult[]) ?? undefined);
    }, []);

    return (
        <ShortCircuitAnalysisResult
            analysisType={ShortCircuitAnalysisType.ALL_BUSES}
            result={result}
            updateResult={updateResult}
            customTablePaginationProps={{
                labelRowsPerPageId: 'muiTablePaginationLabelRowsPerPageAllBusesSCA',
            }}
            {...props}
        />
    );
}
