import { type MuiStyles } from '../../../utils';

export const chipsStyle = {
    chipNotFound: (theme) => ({
        '&.MuiChip-root, &.MuiChip-root[aria-selected="true"]': {
            backgroundColor: `${theme.palette.error.main}!important`,
        },
        '&.MuiChip-root:hover, &.MuiChip-root:focus': {
            backgroundColor: `${theme.palette.error.dark}!important`,
        },
        color: theme.palette.error.contrastText,
    }),
} as const satisfies MuiStyles;
