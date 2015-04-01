import handlerDef=require("./handlerDef");
var url=require("url");
var Promise=require("promise");

export class Router{
    private static instance:Router=null;
    private routers;
    public static getInstance():Router{
      if(Router.instance===null){
        Router.instance=new Router();
      }
      return Router.instance;
    }
    public config(routers){
      this.routers=routers;
    }
    public route(path):handlerDef.HandlerDef{
      for(var key in this.routers){
        var regex=key;
        regex="^" + regex + "$";
        regex=regex.replace('/','\/');

        var match=path.match(regex);
        if(match==null)
        {
          continue;
        }else
        {
          return new handlerDef.HandlerDef(this.routers[key],match.slice(1));
        }
      }
      return null;
    }

    public dispatch(def:handlerDef.HandlerDef,toResolve,toReject,req,res)
    {
      var methodName=req.method.toLowerCase();
      var handlerPath="../handlers/" + def.name;
      return new Promise(function(resolve,reject)
      {
        console.log("load module " + handlerPath);
        var handlerImp=null;
        try{
          handlerImp = require(handlerPath).getInstance();
        }catch(ex)
        {
          console.error("failed to load module " + handlerPath + " due to: " + ex);
        }

        if(handlerImp === null)
        {
            reject({error:"handler is not able to load"});
        }else
        {

          handlerImp.request=req;
          handlerImp.response=res;
          try{
            handlerImp[methodName].apply(handlerImp,def.params);
          }catch(ex)
          {
            console.error("method:" + methodName + " is unable to process");
            reject({error:"method:" + methodName + " is unable to process"});
          }

        }
      }).then(function(){
        toResolve();
      }).catch(function(error)
      {
        res.writeHeader(500,{"Content-Type" : "text/json"});
        res.end(JSON.stringify(error));
        toReject(error);
      });
    }

    public process(req,res,data=null){
      var pathname=url.parse(req.url).pathname;
      var def=this.route(pathname);
      if(def===null)
      {
        return new Promise((resolve,reject)=>
        {
          res.writeHead(404, {"Content-Type": "text/html"});
          res.end("<h1>404 Router handler is not defined</h1>");
        })
      }else
      {
          return new Promise((resolve,reject)=>
          {
            this.dispatch(def,resolve,reject,req,res);
          })
      }

    }
  }
