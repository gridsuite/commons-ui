/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    FunctionComponent,
    MutableRefObject,
    useEffect,
    useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useController } from 'react-hook-form';

export type ErrorMessage =
    | {
          id: string;
          value: string;
      }
    | string;

export interface ErrorInputProps {
    name: string;
    InputField: ({
        message,
    }: {
        message: string | React.ReactNode;
    }) => React.ReactNode;
}

const ErrorInput: FunctionComponent<ErrorInputProps> = ({
    name,
    InputField,
}) => {
    const {
        fieldState: { error },
        formState: { isSubmitting },
    } = useController({
        name,
    });

    const errorRef: MutableRefObject<any> = useRef(null);

    const errorProps = (errorMsg: ErrorMessage | undefined) => {
        if (typeof errorMsg === 'string') {
            return {
                id: errorMsg,
            };
        } else if (typeof errorMsg === 'object') {
            return {
                id: errorMsg.id,
                values: {
                    value: errorMsg.value,
                },
            };
        }
        return {};
    };

    useEffect(() => {
        // the scroll should be done only when the form is submitting
        if (error && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitting]);

    // RHF puts the error in root object when we submit the form
    const errorMsg = error?.message || error?.root?.message;

    return (
        <>
            {errorMsg && (
                <div ref={errorRef}>
                    {InputField({
                        message: <FormattedMessage {...errorProps(errorMsg)} />,
                    })}
                </div>
            )}
        </>
    );
};

export default ErrorInput;
