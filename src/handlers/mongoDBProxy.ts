import handler = require("../libs/baseHandler");
import m=require("../libs/mongodbManager");
import main=require("../service");
import errorCode=require('../libs/errorMsg');

var en=require("lingo").en
var logger=require("../utils/log").Logger.getInstance();

export class MongoDBProxy extends handler.BaseHandler{
  mongodbManager:m.MongoDBManager;
  constructor()
  {
    super();
    logger.debug("mongo db configuration");
    logger.debug(JSON.stringify(main.Main.App.getInstance().config["appConfig"]["mongo_db"]));
    this.mongodbManager=m.MongoDBManager.getInstance(main.Main.App.getInstance().config["appConfig"]["mongo_db"]);
    this.mongodbManager.reconnect();
  }
  public get(params:string = null)
  {
    if(params === null||params == "")
    {
      this.ping();
      return;
    }
    var args:string[]=params.split("/");
    var modelName:string=args[0];
    args=args.slice(1);
    if(en.isSingular(modelName))
    {
      this.getById(modelName,args[0]);
    }else
    {
      this.find(en.singularize(modelName),this.getQuery());
    }
  }
  public ping()
  {
    if(this.mongodbManager.isConnected())
    {
      this.success();
    }else
    {
      this.error("-7");
    }
  }

  public put(params)
  {
    var args:string[]=params.split("/");
    var modelName:string=args[0];
    args=args.slice(1);
    if(en.isSingular(modelName))
    {
      this.updateById(modelName,args[0]);
    }else
    {
      this.updateAll(en.singularize(modelName),this.getQuery());
    }
  }

  public delete(params)
  {
    var args:string[]=params.split("/");
    var modelName:string=args[0];
    args=args.slice(1);
    if(en.isSingular(modelName))
    {
      this.deleteById(modelName,args[0]);
    }else
    {
      this.deleteAll(en.singularize(modelName),this.getQuery());
    }
  }

  public post(params)
  {
    var args:string[]=params.split("/");
    var modelName:string=args[0];
    this.insert(modelName);
  }

  private getById(modelName:string,id:string)
  {
    var Model=require("../models/"+modelName);
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    Model.findOne({"_id" : id}).exec((err,model)=>
    {
      if(err)
      {
        this.error("-17");
        logger.error(err);
        return;
      }
      this.out(this.filter(model,modelName));
    })
  }
  private loadModel(modelName:string)
  {
    try{
      return require("../models/"+modelName);
    }catch(ex){
      logger.error(ex);
      return null;
    }
  }

  private find(modelName:string,query:{})
  {
    var Model=this.loadModel(modelName);
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    this.mongodbManager.query(Model,query,(err,models)=>
    {
      if(err)
      {
        this.error("-17");
        logger.error(err);
        return;
      }
      this.out(models.map((el)=>{
        return this.filter(el,modelName)
      }));
    })
  }

  private filter(el,modelName:String)
  {
    if(modelName == "profile")
    {
      el["payment"]["cardNumber"]="************";
    }else if(modelName == "user")
    {
      el["password"]="******"
    }
    return el;
  }
  private updateById(modelName,objectId)
  {
    var Model=this.loadModel(modelName);
    var that=this;
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    this.receiveData((body)=>
    {
      var  data=null;
      try{
        data=JSON.parse(body);
      }catch(err)
      {
        this.error("-19");
        return;
      }
      if(!!!objectId)
      {
        objectId=data["_id"];
      }
      if(!!!objectId)
      {
        this.error("-27");
        return;
      }
      Model.findOneAndUpdate({"_id":objectId},data,function(err,doc){
        if(err)
        {
          that.error("-29");
          return;
        }
        that.out(doc);
      })
    },(error)=>{
      this.error("-29");
      logger.error(error);
    })
  }

  private updateAll(modelName:string,query)
  {
    var Model=this.loadModel(modelName);
    var that=this;
    if(!!!Model)
    {
      this.error("-13");
      return;
    }

    this.receiveData((body)=>
    {
      var data=null;
      try{
        data=JSON.parse(body);
      }catch(error)
      {
        this.error("-19");
        return;
      }
      this.mongodbManager.update(Model,query,data,function(docs)
      {
        that.out(docs);
      },function(error)
      {
          that.error(error);
      })
    },(error)=>
    {
      this.error("-29");
      logger.error(error);
    })
  }

  private insert(modelName)
  {
    var Model=this.loadModel(modelName);
    var that=this;
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    this.receiveData((body)=>
    {
      try{
        var data=JSON.parse(body);
      }catch(error)
      {
        this.error("-19");
        return;
      }
      var document=new Model(data);
      logger.debug(document);
      document.save(function(err,doc)
      {
        if(err)
        {
          that.error("-15",err);
          return;
        }
        that.out(doc);
      })
    },(error)=>
    {
      this.error("-29");
      logger.error(error);
    })
  }

  private deleteById(modelName,objectId)
  {
    var Model=this.loadModel(modelName);
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    Model.remove({"_id":objectId},(error,doc)=>{
      if(error)
      {
        this.error("-23");
        return;
      }
      this.out(doc);
    })
  }

  private deleteAll(modelName,query)
  {
    var Model=this.loadModel(modelName);
    if(!!!Model)
    {
      this.error("-13");
      return;
    }
    this.mongodbManager.delete(Model,query,(data)=>
    {
      this.out(data);
    },(error)=>
    {
      this.error("-23");
      logger.error(error);
    })
  }

  private success()
  {
    this.out({
      success: true,
      code : Number(0),
      message : errorCode.MSG["0"]
    })
  }
  private error(errorcode,err=null)
  {
    this.out({
      success: false,
      code : Number(errorcode),
      message : errorCode.MSG[errorcode],
      err:err
    })
  }
}
export function getInstance(){
  return new MongoDBProxy;
}
