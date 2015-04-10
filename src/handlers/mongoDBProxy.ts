import handler = require("../libs/baseHandler");
import m=require("../libs/mongodbManager");
import main=require("../service");
import errorCode=require('../libs/errorMsg');
export class MongoDBProxy extends handler.BaseHandler{
  mongodbManager:m.MongoDBManager;
  constructor()
  {
    super();
    this.mongodbManager=m.MongoDBManager.getInstance(main.Main.App.getInstance().config["mongo"]);
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
    this.out("we are done here");

  }
  public ping()
  {
    if(this.mongodbManager.isConnected())
    {
      this.success();
    }else
    {
      this.error("-7")
    }
  }
  private success()
  {
    this.out({
      success: true,
      code : Number(0),
      message : errorCode.MSG["0"]
    })
  }
  private error(errorcode)
  {
    this.out({
      success: false,
      code : Number(errorcode),
      message : errorCode.MSG[errorcode]
    })
  }
}
export function getInstance(){
  return new MongoDBProxy;
}
