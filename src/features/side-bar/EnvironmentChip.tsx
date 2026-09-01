import { Chip } from '@mui/material';
import { Environment } from '../../services';

type EnvironmentChipVariant = 'minimized' | 'expanded';

interface EnvironmentChipProps {
    environment: string;
    variant: EnvironmentChipVariant;
}

const envColors: Record<Environment, string> = {
    REC: '#304FFE',
    DEV: '#DD2C00',
    PRE: '#AA00FF',
    PRO: '#DD2C00',
    DCH: '#2E7D32',
};

const variantStyles: Record<EnvironmentChipVariant, { transform: string; height: string }> = {
    minimized: {
        transform: 'translate(40%, -10%)',
        height: '12px',
    },
    expanded: {
        transform: 'translate(120%, -10%)',
        height: '15px',
    },
};

function isEnvironment(value: string): value is Environment {
    return value in envColors;
}

export function EnvironmentChip({ environment, variant }: Readonly<EnvironmentChipProps>) {
    if (!isEnvironment(environment)) {
        return null;
    }

    return (
        <Chip
            label={environment}
            size="small"
            sx={{
                position: 'absolute',
                top: 0,
                right: 5,
                fontSize: '0.5rem',
                backgroundColor: envColors[environment],
                color: '#ffffff',
                '& .MuiChip-label': {
                    padding: '0 4px',
                },
                ...variantStyles[variant],
            }}
        />
    );
}
