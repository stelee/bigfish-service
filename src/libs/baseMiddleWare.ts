/// <reference path='../typings/es6-promise/es6-promise.d.ts' />
export interface BaseMiddleWare
{
  run():Promise<any>;
}
