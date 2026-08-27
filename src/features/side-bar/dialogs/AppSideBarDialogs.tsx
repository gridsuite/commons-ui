import { UserProfile } from 'oidc-client-ts';
import { GridSuiteModule, AboutDialog, UserInformationDialog, UserSettingsDialog } from '../../topBar';
import { useAppSideBarDialogs } from './AppSideBarDialogProvider';

type AppSideBarDialogsProps = {
    isDeveloperMode: boolean;
    handleChangeDeveloperMode: (newValue: boolean) => void;
    userProfile?: UserProfile;
    appName: string;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
};

export function AppSideBarDialogs({
    appLicense,
    appVersion,
    additionalModulesPromise,
    globalVersionPromise,
    appName,
    userProfile,
    isDeveloperMode,
    handleChangeDeveloperMode,
}: Readonly<AppSideBarDialogsProps>) {
    const {
        isAboutDialogOpen,
        setIsAboutDialogOpen,
        isProfileDialogOpen,
        setIsProfileDialogOpen,
        isProfileSettingsDialogOpen,
        setIsProfileSettingsDialogOpen,
    } = useAppSideBarDialogs();

    return (
        <>
            <AboutDialog
                appLicense={appLicense}
                appVersion={appVersion}
                open={isAboutDialogOpen}
                onClose={() => setIsAboutDialogOpen(false)}
                additionalModulesPromise={additionalModulesPromise}
                globalVersionPromise={globalVersionPromise}
                appName={appName}
            />
            <UserInformationDialog
                openDialog={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                userProfile={userProfile ?? undefined}
            />
            <UserSettingsDialog
                openDialog={isProfileSettingsDialogOpen}
                onClose={() => setIsProfileSettingsDialogOpen(false)}
                developerMode={isDeveloperMode}
                onDeveloperModeClick={handleChangeDeveloperMode}
            />
        </>
    );
}
