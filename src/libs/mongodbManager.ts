import mongoose=require("mongoose");
import l=require("../utils/log");

var logger=l.Logger.getInstance();

///<reference path='../typings/mongoose/mongoose.d.ts' />
class MongoDBManager{
  hostname:string;
  port:string;
  dbName:string;
  mongoose: mongoose.Mongoose;
  connection:mongoose.Connection;

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
  private limit(mQuery,val:number){
    mQuery.limit(val);
  }
  private sort(mQuery,val){
    mQuery.sort(val);
  }
  private getConnectionString():string{
    return 'mongodb://'+ this.hostname + ':' + this.port + '/' + this.dbName
  }
}
