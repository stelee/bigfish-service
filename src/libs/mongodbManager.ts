import mongoose=require("mongoose");

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
  }
}
