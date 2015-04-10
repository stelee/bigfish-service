import mongoose=require("mongoose");
import l=require("../utils/log");
import w=require("../utils/walkpath");
import n=require("../utils/null");

var logger=l.Logger.getInstance();

///<reference path='../typings/mongoose/mongoose.d.ts' />
export class MongoDBManager{
  hostname:string;
  port:string;
  dbName:string;
  mongoose: mongoose.Mongoose;
  connection:mongoose.Connection;

  private static  instance:MongoDBManager=null;

  public static getInstance(config:{[id:string]:string}=undefined):MongoDBManager
  {
    if(MongoDBManager.instance === null){
      MongoDBManager.instance=new MongoDBManager(config);
    }
    return MongoDBManager.instance;
  }

  constructor(config:{[id:string]:string}={
    "hostname" : "localhost"
    ,"port" : "27017"
    ,"dbName" : "test"
  })
  {
    this.hostname=config['hostname'];
    this.port=config['port'];
    this.dbName=config['dbName'];
    this.connection=null;
    this.mongoose = mongoose;
    this.connect();
  }
  public connect(){
    var connectionStr=this.getConnectionString();
    logger.debug("connect to " + connectionStr);
    this.mongoose.connect(connectionStr);
    var connection=this.mongoose.connection;
    connection.on('error',(err)=>logger.error(err));
    connection.on('open',()=>logger.info("connection  to the mongodb is established."));
  }

  public reconnect(){
      if(this.mongoose.connection.readyState === 0){
        this.connect();
      }
  }

  public isConnected():boolean{
    return this.mongoose.connection.readyState === 1;
  }


  //private
  private buildQuery(query,test=[],dryOptionFlag:boolean=false):[{},{}]{
    var q=w.path(query,"q");
    if(q===null){
      q={};
    }else{
      q=JSON.parse(q);
    }
    var options={};
    w.walk(q,(val)=>{
      var match=val.match(/^\/(.+)\/$/);
      if(match === null){
        return val;
      }else{
        return new RegExp(match[1]);//the query will support the regex
      }
    });
    //build the option
    for(var prop in query){
      var val=query[prop];
      if(prop === "q"){
        continue;
      }
      var match=val.match(/^\/(.+)\/$/);
      if(match === null){
        if(test.indexOf(prop)>=0){
          var realprop;
          if(!!dryOptionFlag){
            realprop=prop.replace(/^_/,"");//remove the "_" prefix
          }else{
            realprop = prop;
          }
          options[realprop]=val;
        }else{
          try{
            q[prop]=JSON.parse(val);
          }catch(e){
            q[prop]=val;
          }
        }
      }else{
        val=new RegExp(match[1]);
        q[prop]=val;
      }
    }
    return [q,options];
  }

  public update(Model,query,data,callBack:Function,onError:Function)
  {
    try
    {
      var queryoption=this.buildQuery(query,[
      "_safe"
      ,"_upsert"
      ,"_multi"
      ,"_strict"
      ,"_overwrite"
      ],true);
      query=queryoption[0];
      var options=queryoption[1];
      options["multi"] = options["multi"] || true;//reset the default value  of the options
      Model.update(query,data,options,(error,data)=>{
        if(!!error)
          onError(error);
        else
          callBack(data);
      });
    }catch(e)
    {
      if(!!onError) onError(e);
      console.error(e);
    }
  }

  public delete(Model,query,callBack:Function,onError:Function)
  {
    if(n.isEmpty(query))
    {
      onError("Can't delete all by emnpty parameters");
      return;
    }
    var queryoption=this.buildQuery(query);
    query=queryoption[0];
    var options=queryoption[1];
    try{
      Model.remove(query,(error,data)=>{
        if(!!error)
          onError(error);
        else
          callBack(data);
      });
    }catch(e){
      if(!!onError) onError(e);
      console.error(e);
    }
  }
  public query(Model,query,callBack:Function,onError:Function)
  {
    if(n.isEmpty(query))
    {
      Model.find().exec(callBack);
      return;
    }
    var queryoption=this.buildQuery(query,["_limit","_sort","_select"]);
    query=queryoption[0];
    var options=queryoption[1];
    var mQuery=Model.find(query);
    for(var prop in options)
    {
      this[prop].call(this,mQuery,options[prop]);
    }
    mQuery.exec(callBack);
  }



  private _limit(mQuery,val:number){
    mQuery.limit(val);
  }
  private _sort(mQuery,val){
    mQuery.sort(val);
  }
  private  _select(mQuery,val){
    mQuery.select(val);
  }
  private getConnectionString():string{
    return 'mongodb://'+ this.hostname + ':' + this.port + '/' + this.dbName
  }
}
