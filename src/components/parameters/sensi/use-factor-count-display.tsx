import {useMemo} from "react";
import type {MuiStyles} from "../../../utils";
import {Box, CircularProgress} from "@mui/material";
import {FormattedMessage} from "react-intl";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const styles = {
    circularProgress: (theme) => ({
        display: 'flex',
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    }),
    errorOutlineIcon: (theme) => ({
        marginRight: theme.spacing(1),
        color: theme.palette.error.main,
        display: 'flex',
    }),
    textInfo: (theme) => ({
        color: theme.palette.primary.main,
        display: 'flex',
    }),
    textInitial: {
        color: 'grey',
    },
    textAlert: (theme) => ({
        color: theme.palette.error.main,
        display: 'flex',
    }),
} as const satisfies MuiStyles;

const renderLoadingState = () => {
    return (
        <Box sx={styles.textInfo}>
            <CircularProgress size="1em" sx={styles.circularProgress} />
        </Box>
    );
};

export const useFactorCountDisplay = (
    count: number,
    maxCount: number,
    messageId: string,
    launchLoader: boolean
) => {
    return useMemo(() => {
        const renderCountDisplay = () => {
            const isOverLimit = count > maxCount;
            const isOverMillion = count > 999999;

            if (isOverMillion) {
                return (
                    <Box sx={styles.textAlert}>
                        <ErrorOutlineIcon sx={styles.errorOutlineIcon} />
                        <FormattedMessage
                            id={messageId}
                            values={{
                                count: "999999",
                                suffix: '+',
                            }}
                        />
                    </Box>
                );
            }

            if (isOverLimit) {
                return (
                    <Box sx={styles.textAlert}>
                        <ErrorOutlineIcon sx={styles.errorOutlineIcon} />
                        <FormattedMessage
                            id={messageId}
                            values={{
                                count: count.toString(),
                                suffix: ''
                            }}
                        />
                    </Box>
            );
            }

            if (count === 0) {
                return (
                    <Box sx={styles.textInitial}>
                    <FormattedMessage
                        id={messageId}
                values={{ count: count.toString(), suffix: '' }}
                />
                </Box>
            );
            }

            return (
                <Box sx={styles.textInfo}>
                <FormattedMessage
                    id={messageId}
            values={{ count: count.toString(), suffix: '' }}
            />
            </Box>
        );
        };

        return launchLoader ? renderLoadingState() : renderCountDisplay();
    }, [count, maxCount, messageId, launchLoader, renderLoadingState]);
};
