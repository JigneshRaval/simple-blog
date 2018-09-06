// TODO: Not in use, Remove Later
// ==============================================

declare global {
    /* interface JQuery {
      $(options?: JQuery): JQuery
    } */

    declare module 'jquery' {
        export = jQuery;
    }

    declare module './src/assets/js/jquery' {
        export = jQuery;
    }

    declare const jQuery: any;
    declare const $: any;
}
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

// Added to import json files in .ts files using import method, else will get error :
// ERROR in /list-view.component.ts(22,23): error TS2307: Cannot find module '../../assets/data/country.json'.
// USAGE : import * as data from '../../assets/data/country.json';
declare module "*.json" {
    const value: any;
    export default value;
}
