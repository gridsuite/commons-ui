/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable max-classes-per-file, class-methods-use-this */

import {
    MetadataService,
    SigninRequest,
    SigninResponse,
    SignoutRequest,
    SignoutResponse,
    User,
    UserManager,
    UserManagerEvents,
    UserManagerSettings,
} from 'oidc-client';

class Events implements UserManagerEvents {
    userLoadedCallbacks: ((data: any) => void)[] = [];

    addUserLoaded(callback: (data: any) => void) {
        this.userLoadedCallbacks.push(callback);
    }

    // eslint-disable-next-line
    addSilentRenewError(callback: (data: any) => void) {
        // Nothing to do
    }

    load(/* container: User */) {
        // not implemented
    }

    unload() {}

    removeUserLoaded() {}

    addUserUnloaded() {}

    removeUserUnloaded() {}

    removeSilentRenewError() {}

    addUserSignedIn() {}

    removeUserSignedIn() {}

    addUserSignedOut() {}

    removeUserSignedOut() {}

    addUserSessionChanged() {}

    removeUserSessionChanged() {}

    addAccessTokenExpiring() {}

    removeAccessTokenExpiring() {}

    addAccessTokenExpired() {}

    removeAccessTokenExpired() {}
}

export default class UserManagerMock implements UserManager {
    settings;

    events;

    user: User = {
        profile: {
            name: 'John Doe',
            email: 'Jhon.Doe@rte-france.com',
            iss: '',
            sub: '',
            aud: '',
            exp: Number.MAX_SAFE_INTEGER,
            iat: 0,
        },
        id_token:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSJ9.eyJhdWQiOiI5YzQwMjQ2MS1iMmFiLTQ3NjctOWRiMy02Njg1OWJiMGZjZDAiLCJpc3MiOiJodHRwczovL2' +
            'xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5L3YyLjAiLCJpYXQiOjE1ODUzMzEyNDksIm5iZiI6MTU4NTMzMTI0OSwiZXhwIjoyNTg1MzM1MTQ5LCJhaW8iOiJBV1FB' +
            'bS84UEFBQUF3Q0xyTDRIUEUvTnVjOU9OdHN0SUV4cVpyMUlqa1FGbXJvUW5EUzJBaksyWnpneUhQTldPdkE3bitveHkvRzgxWElsb1A0TitsQjZINFJteElwakhNYVArTjIyTzVnMUFaR04yc1d6VHA5T3JWMDIvOXhndXJBMjZrdU' +
            'NXbGg2RSIsImF0X2hhc2giOiJJaWRYdGRHdzVkbjlOZDFQblVvbDh3IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkLyIsIm5vbmNlIjoiMjkzZTcxNzhm' +
            'OWE5NGZlNjg1ZWY3MjdlZTg5MTYxYjEiLCJzdWIiOiJyTnZjWXJMSXJSN25iSDJPQlhoOFkzU05wZEtPc3dfTUNkX3F3NF9vNDRJIiwidGlkIjoiNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5IiwidXRpIjoiUF' +
            'BYdkw1UWxDMG1oMGp2N3NaNGJBQSIsInZlciI6IjIuMCJ9.dPAh24KTfsqmDaRoBtMLcayAWnDqVtydQ97P1a99dg93JsDu4Jhxju9vlzvjd6Ro5a1RZdrKFKB_pgC2DkQ3wSeYjpdSNyBAlW1_ryq65JkTJVMp33OsM_7SdjaRIiJ' +
            'fPiJ3U9jRBSyj7ofoHCLUjD_Uu-XreKxpMGhFHOQIO72UfXg8TBpsapjkEv9Dyz2UqMa2BQvO5mxKw93LNg5BI6j2a5LhbMEmmRWqfxWGITJ9TWfHjYdFkrXKcmvWZ9D2b4tsw_5NorDxkuzVFhA89M_0ASzOXoj1Yb6LgdkzWXDim' +
            'ssvyyz5Oe4V3gdkAe8Jj7Uwz-9AR-MO2kNkH7ytHA',
        session_state: 'session state',
        access_token:
            'eyJ0eXAiOiJKV1QiLCJub25jZSI6InhKWHlQeXVrU1paQ3BOeEcxZUQway1lVDF0YzZtQ01ZVkZKcnBDOTJxc28iLCJhbGciOiJSUzI1NiIsIng1dCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSIsImtpZC' +
            'I6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83NTAyZGFkNS1kNjRjLTQ2YzctOWQ' +
            '0Ny1iMTZmNTgwZmNmYTkvIiwiaWF0IjoxNTg1MzMxMjQ5LCJuYmYiOjE1ODUzMzEyNDksImV4cCI6MTU4NTMzNTE0OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhQQUFBQXdwc3RYMlVkY2VDQWx4dU9tVHpIY0R3R' +
            'lhTWUtYanIvZUNTSi9PdTRqbTJyUVBCUml0U1dWMThmNldCVEdNdnQ5ZGx0Ry9lTXB1VXZqaTN2NCtzanh3PT0iLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwMzQwMDExOUZEOTIxMiIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3B' +
            'sYXluYW1lIjoic3BhIiwiYXBwaWQiOiI5YzQwMjQ2MS1iMmFiLTQ3NjctOWRiMy02Njg1OWJiMGZjZDAiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImNoYW1zZWRkaW5lLmJlbmhhbWVkQGVuc2ktdW1hLnRuIiwiZmFtaWx5X25hb' +
            'WUiOiJCRU5IQU1FRCIsImdpdmVuX25hbWUiOiJDaGFtc2VkZGluZSIsImlkcCI6ImxpdmUuY29tIiwiaXBhZGRyIjoiNzcuMjA0LjE0Ni4xNTkiLCJuYW1lIjoiQ2hhbXNlZGRpbmUgQkVOSEFNRUQiLCJvaWQiOiIzNTIzYmQ3OC0' +
            'yZjIxLTQ3ZjYtODhlOC1hYWIzYjZmMjdmNjAiLCJwbGF0ZiI6IjE0IiwicHVpZCI6IjEwMDMyMDAwOURFMDg1NkEiLCJzY3AiOiJVc2VyLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzdWIiOiJjVEd5LVlfV3FLR2x1cmRUV' +
            'DdSUVlfY3FjSDJoVHpEdllZTmotQ3hONXA4IiwidGlkIjoiNzUwMmRhZDUtZDY0Yy00NmM3LTlkNDctYjE2ZjU4MGZjZmE5IiwidW5pcXVlX25hbWUiOiJsaXZlLmNvbSNjaGFtc2VkZGluZS5iZW5oYW1lZEBlbnNpLXVtYS50biI' +
            'sInV0aSI6IlBQWHZMNVFsQzBtaDBqdjdzWjRiQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoick52Y1lyTElyUjduYkgyT0JYaDhZM1NOcGRLT3N3X01DZF9xdzRfbzQ0SSJ9LCJ4bXNfdGNkdCI6MTU4MjgyMDM1Mn0.W_' +
            'ccOGW_AGdg37KSMi7LWHtvm3Mw5p1dHjgDIrUaXduKF2iLS4dCaPw7yeo4VjAcOyV6C0h6ABLDCtkwVt8BSDTIIU7DaT8k2bRbMCCq69BmeiYPsbp-yX6ywGCx5DHsnOLqI2oHbBQktA2Nmv9Va651Pbm3OpSPuGPdVimkFCcnisiGl' +
            'UOej1ZMNwyVT6386O2pERPtxmFUt_D1dKLxBXxBNxLVUG5BG3bI7wMpBOHEUA5CbaBzYXmGrLMXVVbrj9OsF-WQ6aNoqsm9cicX6pJB60lFz1dxLeSgcFO7Zh2K3PFe4FnXCqAvNPadQMz_kJEO9_phlDV85c2MPqeXbA',
        token_type: 'Bearer',
        scope: 'scopes',
        scopes: ['scopes'],
        expires_at: Number.MAX_SAFE_INTEGER,
        expires_in: Number.MAX_SAFE_INTEGER,
        expired: false,
        state: null,
        toStorageString: () => 'Mock of UserManager',
    };

    readonly metadataService: MetadataService = null as unknown as MetadataService;

    constructor(settings: UserManagerSettings) {
        this.settings = settings;
        this.events = new Events();
    }

    // eslint-disable-next-line class-methods-use-this
    getUser() {
        return Promise.resolve(JSON.parse(sessionStorage.getItem('powsybl-gridsuite-mock-user') ?? 'null'));
    }

    async signinSilent(): Promise<User> {
        console.debug('signinSilent..............');
        const localStorageUser = JSON.parse(localStorage.getItem('powsybl-gridsuite-mock-user') ?? 'null');
        if (localStorageUser === null) {
            throw new Error('End-User authentication required');
        }
        sessionStorage.setItem('powsybl-gridsuite-mock-user', JSON.stringify(localStorageUser));
        this.events.userLoadedCallbacks.forEach((c) => c(localStorageUser));
        return localStorageUser;
    }

    // eslint-disable-next-line class-methods-use-this
    signinSilentCallback() {
        console.error('Unsupported, iframe signinSilentCallback in UserManagerMock (dev mode)');
        return Promise.reject();
    }

    signinRedirect() {
        localStorage.setItem('powsybl-gridsuite-mock-user', JSON.stringify(this.user));
        window.location.href = './sign-in-callback';
        return Promise.resolve();
    }

    // eslint-disable-next-line class-methods-use-this
    signoutRedirect() {
        sessionStorage.removeItem('powsybl-gridsuite-mock-user');
        localStorage.removeItem('powsybl-gridsuite-mock-user');
        window.location.href = '.';
        return Promise.resolve();
    }

    signinRedirectCallback() {
        sessionStorage.setItem('powsybl-gridsuite-mock-user', JSON.stringify(this.user));
        this.events.userLoadedCallbacks.forEach((c) => c(this.user));
        return Promise.resolve(this.user);
    }

    clearStaleState() {
        return Promise.resolve();
    }

    storeUser() {
        return Promise.resolve();
    }

    removeUser() {
        return Promise.resolve();
    }

    signinPopup() {
        return Promise.resolve(this.user);
    }

    signinPopupCallback() {
        return Promise.resolve(undefined);
    }

    signoutRedirectCallback() {
        return Promise.resolve({} as SignoutResponse);
    }

    signoutPopup() {
        return Promise.resolve();
    }

    signoutPopupCallback() {
        return Promise.resolve();
    }

    signinCallback() {
        return Promise.resolve(this.user);
    }

    signoutCallback() {
        return Promise.resolve(undefined);
    }

    querySessionStatus() {
        return Promise.resolve({
            session_state: '',
            sub: '',
            sid: undefined,
        });
    }

    revokeAccessToken() {
        return Promise.resolve();
    }

    startSilentRenew() {
        return Promise.resolve();
    }

    stopSilentRenew() {
        return Promise.resolve();
    }

    createSigninRequest() {
        return Promise.resolve({} as SigninRequest);
    }

    processSigninResponse() {
        return Promise.resolve({} as SigninResponse);
    }

    createSignoutRequest() {
        return Promise.resolve({} as SignoutRequest);
    }

    processSignoutResponse() {
        return Promise.resolve({} as SignoutResponse);
    }
}
