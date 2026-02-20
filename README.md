# commons-ui

Library for sharing GridSuite apps commons components

#### For developers

The commons-ui library have a demo app in which you can call your components to test them.
The `npm start` command install the library's dependencies then launches the demo app.

##### Development Scripts

- **`npm run type-check`** - Runs TypeScript type checking without emitting files. This ensures all developers use the project's local TypeScript version from `node_modules` rather than a potentially different globally-installed version. Run this to verify your code has no type errors before committing.

- **`npm run build`** - Builds the library. Note: This automatically runs `npm run prebuild` first.

- **`npm run prebuild`** - Runs linting and type checking before the build. This script is executed automatically by npm before `npm run build` and ensures that the build is not executed if linting or type checking fails. You don't need to call this manually unless you want to verify code quality without building.

##### Local Testing

If you want to test your library integration with a consumer application my-app you have first
to build commons-ui via

- `npm install` (if not already done to get `tsc`)
- `npm run build:pack`

Then in the my-app project :

- Change the commons-ui dependency in my-app's package.json from  
  `@gridsuite/commons-ui:"^x.x.x"`  
  to  
  `@gridsuite/commons-ui:"file:{PATH_TO_LIBRARY}/gridsuite-commons-ui-{LIBRARY_VERSION}.tgz"`
- `npm install`
- `npm start`

_Warning_ : with Create React App, we realised the library was not updating correctly if you try to install the library multiple times.
To fix this, run this command from the app **after** running "npm install"

- rm -Rf node_modules/.cache

#### For integrators

If you want to deploy a new version of commons-ui in the [NPM package registry](https://www.npmjs.com/package/@gridsuite/commons-ui),
first you need **some permissions**. You need to be a member of the *gridsuite* organization and a member of the *'developers'* team.
Only in this case, you need to follow the steps below:

- [Make a release action](https://github.com/gridsuite/commons-ui/actions/workflows/release.yml)
- In the 'run workflow' combobox select, let the branch on main
- Enter the type of evolution (major | minor | patch)
- Click 'run workflow'

Otherwise ask someone who has the permission.

#### License Headers and dependencies checking

To check dependencies license compatibility with this project one locally, please run the following command :

```
npm run licenses-check
```

Notes :

- Check [license-checker-config.json](license-checker-config.json) for license white list and exclusion.
  If you need to update this list, please inform organization's owners.
