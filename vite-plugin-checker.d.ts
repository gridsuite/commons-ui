// End up to mock dts of optional dependencies that aren't installed
declare module 'stylelint' {
    export type LinterOptions = any;
}
declare module 'vscode-languageserver/node' {
    export type InitializeParams = any;
}
