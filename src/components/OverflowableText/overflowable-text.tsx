/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    ReactElement,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Box, BoxProps, SxProps, Theme, Tooltip, styled } from '@mui/material';
import { Style } from 'node:util';

const overflowStyle = {
    overflow: {
        display: 'inline-block',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    tooltip: {
        whiteSpace: 'pre',
        width: 'fit-content',
        maxWidth: 'fit-content',
    },
};

const multilineOverflowStyle = (numberOfLinesToDisplay?: number): SxProps => ({
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: numberOfLinesToDisplay /* number of lines to show */,
    lineClamp: numberOfLinesToDisplay,
    WebkitBoxOrient: 'vertical',
    wordWrap: 'break-word', // prevent bug when writing a very long word
});

export interface OverflowableTextProps extends BoxProps {
    text?: ReactElement | string;
    maxLineCount?: number;
    tooltipStyle?: Style;
    tooltipSx?: SxProps<Theme>;
}

export const OverflowableText = styled(
    ({
        text,
        maxLineCount, // overflowable text can be displayed on several lines if this is set to a number > 1 tooltipStyle,
        tooltipStyle,
        tooltipSx,
        className,
        children,
        ...props
    }: OverflowableTextProps) => {
        const element = useRef<HTMLHeadingElement>();

        const isMultiLine = useMemo(
            () => maxLineCount && maxLineCount > 1,
            [maxLineCount]
        );

        const [overflowed, setOverflowed] = useState(false);

        const checkOverflow = useCallback(() => {
            if (!element.current) {
                return;
            }

            if (isMultiLine) {
                setOverflowed(
                    element.current.scrollHeight > element.current.clientHeight
                );
            } else {
                setOverflowed(
                    element.current.scrollWidth > element.current.clientWidth
                );
            }
        }, [isMultiLine, setOverflowed, element]);

        useLayoutEffect(() => {
            checkOverflow();
        }, [
            checkOverflow,
            text,
            element.current?.scrollWidth,
            element.current?.clientWidth,
            element.current?.scrollHeight,
            element.current?.clientHeight,
        ]);

        const defaultTooltipSx = !tooltipStyle ? overflowStyle.tooltip : false;
        // the previous tooltipStyle classname API was replacing default, not
        // merging with the defaults, so keep the same behavior with the new tooltipSx API
        const finalTooltipSx = tooltipSx || defaultTooltipSx;
        const tooltipStyleProps = {
            ...(tooltipStyle && { classes: { tooltip: tooltipStyle } }),
            ...(finalTooltipSx && {
                slotProps: { tooltip: { sx: finalTooltipSx } },
            }),
        };

        return (
            <Tooltip
                title={text || ''}
                disableHoverListener={!overflowed}
                {
                    ...tooltipStyleProps /* legacy classes or newer slotProps API */
                }
            >
                <Box
                    {...props}
                    ref={element}
                    className={className}
                    sx={
                        isMultiLine
                            ? multilineOverflowStyle(maxLineCount)
                            : overflowStyle.overflow
                    }
                >
                    {children || text}
                </Box>
            </Tooltip>
        );
    }
)({});

export default OverflowableText;
