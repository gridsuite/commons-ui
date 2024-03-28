import { useSnackMessage } from './useSnackMessage';
import { useCallback, useEffect, useState } from 'react';

export function useParameterState(
    paramName: string,
    paramGlobalState: unknown,
    updateConfigParameter: (param: string, value: unknown) => Promise<unknown>
) {
    const { snackError } = useSnackMessage();

    const [paramLocalState, setParamLocalState] =
        useState<unknown>(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value: unknown) => {
            setParamLocalState(value);
            updateConfigParameter(paramName, value).catch((error) => {
                setParamLocalState(paramGlobalState);
                snackError({
                    messageTxt: error.message,
                    headerId: 'paramsChangingError',
                });
            });
        },
        [
            paramName,
            snackError,
            setParamLocalState,
            paramGlobalState,
            updateConfigParameter,
        ]
    );

    return [paramLocalState, handleChangeParamLocalState];
}
