import handler = require("../libs/baseHandler");

class Index extends handler.BaseHandler{

  public get(){
    this.writeToJSON("hello,world")
  }
}
export function getInstance()
{
  return new Index();
}
