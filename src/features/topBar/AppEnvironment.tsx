interface AppEnvironmentProps {
    envName: string;
    envColor: string;
}
export function AppEnvironment({ envName, envColor }: AppEnvironmentProps) {
    return (
        <span
            style={{
                marginLeft: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '4px',
                ...(envColor ? { backgroundColor: envColor } : {}),
            }}
        >
            {envName}
        </span>
    );
}
