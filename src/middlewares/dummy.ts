import baseMW=require("../libs/baseMiddleWare");

var Promise=require("promise");

/// <reference path='../typings/es6-promise/es6-promise.d.ts' />
export class Dummy implements baseMW.BaseMiddleWare
{
  run():Promise<any>
  {
    return new Promise(function(resolve,reject)
    {
      resolve("Hello,Middle ware");
    })
  }
}
