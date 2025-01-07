# commons-ui

Library for sharing GridSuite apps commons components


## Use and integration
### MUI & Emotion styles
Some components of commons-ui define custom rules in Mui styling system that need
to be initialized.  
To have TypeScript helping (through module augmentation), you can in a `.d.ts`
file at the root of your project source folder (like `globals.d.ts`):
```ts
/// <reference types="@gridsuite/commons-ui/module-mui" />
/// <reference types="@gridsuite/commons-ui/module-emotion" />
```
Typescript will check the new options with function related to `Theme` interface.


## Build & deploy
### For developers

The commons-ui library have a demo app in which you can call your components to test them.
The `npm start` command install the library's dependencies then launches the demo app.

If you want to test your library integration with a consumer application my-app you have first
to build commons-ui via 
- `npm install` (if not already done to get `tsc`)
- `npm run build:pack`

Then in the my-app project :
- Change the commons-ui dependency in my-app's `package.json`
    from`@gridsuite/commons-ui:"^x.x.x"`
    to `@gridsuite/commons-ui:"file:{PATH_TO_LIBRARY}/gridsuite-commons-ui-{LIBRARY_VERSION}.tgz"` 
- `npm install`
- `npm start`

> [!WARNING]
> with Create React App, we realised the library was not updating correctly if you try to install the library multiple times.  
> To fix this, run this command from the app **after** running "npm install"
> ```shell
> rm -Rf node_modules/.cache
> ```


### For integrators

If you want to deploy a new version of commons-ui in the [NPM package registry](https://www.npmjs.com/package/@gridsuite/commons-ui),
you need to follow the steps below:
  - [Make a release action](https://github.com/gridsuite/commons-ui/actions/workflows/release.yml)
  - In the 'run workflow' combobox select, let the branch on main
  - Enter the type of evolution (major | minor | patch)
  - Enter your NPM access token (it must be an **automation** access token to bypass 2FA, see the [access token documentation](https://docs.npmjs.com/creating-and-viewing-access-tokens) for details)
  - Click 'run workflow'


### License Headers and dependencies checking

To check dependencies license compatibility with this project one locally, please run the following command :
```shell
npm run licenses-check
```

> [!NOTE]  
> Check [license-checker-config.json](license-checker-config.json) for license whitelist and exclusion.
> If you need to update this list, please inform organization's owners.
