/// <reference path='typings/node/node.d.ts' />
/// <reference path='typings/mongoose/mongoose.d.ts' />

type TRouterTable={[id:string]:string};

import mwp=require("./libs/middleWareProcessor");
import mw=require("./middlewares/dummy");

module Main{

  var http=require("http"),
    logger=require("./utils/log").Logger.getInstance(),
    router=require("./router/router").Router.getInstance();

  export class Config{
    port:Number;
    listener:String;
    routerTable:TRouterTable;
    constructor(listener:String="0.0.0.0",port:Number=9000,routerTable:TRouterTable={}){
      this.listener=listener;
      this.port =port;
      this.routerTable=routerTable;
    }
    public configRouterTable(routerTable:TRouterTable){
      this.routerTable=routerTable;
    }
  }
  export class Main{
    public run(config:Config){
      logger.info("start the service at "+config.listener+" : "+config.port);
      router.config(config.routerTable);
      var middlewareProcessor=mwp.MiddleWareProcessor.getInstance();
      http.createServer((req,res)=>{
        //TODO:
        //you can add middlewhere here
        //should use promise to process the req, res
        //because middleware may be running asynchronized
        logger.debug("receive the request");
        middlewareProcessor.register(new mw.Dummy());
        middlewareProcessor.runAsPromise().then(function(data){
          logger.debug("return value from middleware:" + data);
          router.process(req,res,data);
        }).catch(function(error){
          logger.debug("error for middleware?");
          logger.debug(error);
          res.writeHeader(500,{"Content-Type" : "text/json"});
          res.end(JSON.stringify(error));
        });

      }).listen(config.port,config.listener);
    }
  }
}

var main=new Main.Main();
//config start
var config=new Main.Config();
config.configRouterTable({
  "/": "index",
  "/hello/(\\w*)" : "bonjour"
})
//config end
main.run(config);
