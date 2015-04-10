import handler = require("../libs/baseHandler");

export class Index extends handler.BaseHandler{

  public get(){
    this.out("hello,world")
  }
}
export function getInstance()
{
  return new Index();
}
