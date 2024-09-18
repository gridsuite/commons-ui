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

*Warning* : with Create React App, we realised the library was not updating correctly if you try to install the library multiple times.
To fix this, run this command from the app **after** running "npm install"
- rm -Rf node_modules/.cache
 

### For integrators

If you want to deploy a new version of commons-ui in the [NPM package registry](https://www.npmjs.com/package/@gridsuite/commons-ui),
you need to follow the steps below:
-   Update to the new version in [package.json](https://github.com/gridsuite/commons-ui/blob/main/package.json) (example `0.6.0`)
-   Build it: `npm install`
-   Commit the package.json and package-lock.json files, push to a branch, make a PR, have it reviewed and merged to main.
-   [Make a release](https://github.com/gridsuite/commons-ui/releases/new) on GitHub by creating a new tag on the last commit. On the release creation page:
    - In "Choose a tag": type the tag you want to create (ex.: v0.6.0) and select "create new tag"
    - In "Target": click on "recent commit" tab and select your release commit
    - Click on "Generate release note"
    - Click on "Publish release"
-   It will trigger a job that will publish the release on NPM

### License Headers and dependencies checking

To check dependencies license compatibility with this project one locally, please run the following command :
```shell
npm run licenses-check
```

Notes:  
Check [license-checker-config.json](license-checker-config.json) for license white list and exclusion.
If you need to update this list, please inform organization's owners.
