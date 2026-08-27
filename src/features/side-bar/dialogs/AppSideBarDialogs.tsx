import { UserProfile } from 'oidc-client-ts';
import { GridSuiteModule, AboutDialog, UserInformationDialog, UserSettingsDialog } from '../../topBar';
import { SideBarDialogType, useAppSideBarDialogs } from './AppSideBarDialogProvider';

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
    const { openDialog, closeDialog } = useAppSideBarDialogs();

    return (
        <>
            <AboutDialog
                appLicense={appLicense}
                appVersion={appVersion}
                open={openDialog === SideBarDialogType.ABOUT}
                onClose={closeDialog}
                additionalModulesPromise={additionalModulesPromise}
                globalVersionPromise={globalVersionPromise}
                appName={appName}
            />
            <UserInformationDialog
                openDialog={openDialog === SideBarDialogType.PROFILE}
                onClose={closeDialog}
                userProfile={userProfile ?? undefined}
            />
            <UserSettingsDialog
                openDialog={openDialog === SideBarDialogType.PROFILE_SETTINGS}
                onClose={closeDialog}
                developerMode={isDeveloperMode}
                onDeveloperModeClick={handleChangeDeveloperMode}
            />
        </>
    );
}
