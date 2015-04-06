/// <reference path='typings/node/node.d.ts' />
/// <reference path='typings/mongoose/mongoose.d.ts' />

type TRouterTable={[id:string]:string};

import mwp=require("./libs/middleWareProcessor");
import mw=require("./middlewares/dummy");

var merge=require("merge");//no d.ts supported

module Main{

  var http=require("http"),
    logger=require("./utils/log").Logger.getInstance(),
    router=require("./router/router").Router.getInstance();

  export class Config{
    port:Number;
    listener:String;
    routerTable:TRouterTable;
    appConfig:any;
    constructor(configFilePath:string){
      var config=require(configFilePath+".json");
      var profile=process.argv[2]  //a simple profile check
      if(!!profile){
        config=merge.recursive(true,config,require(configFilePath+"_"+profile+".json"));
      }
      this.listener=config["listener"]||"0.0.0.0";
      this.port =config["port"]||9000;
      this.routerTable=config["router_table"] || {};
      this.appConfig=config;
    }
    public configRouterTable(routerTable:TRouterTable){
      this.routerTable=routerTable;
    }
  }
  export class App{
    config:Config;
    private static instance:App=null;
    public static  getInstance():App{
      if(App.instance === null){
        App.instance = new App();
      }
      return App.instance;
    }
    public run(config:Config){
      this.config=config;
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


Main.App.getInstance().run(new Main.Config("./config/config"));
