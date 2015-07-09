import handler = require("../libs/baseHandler");

export class Index extends handler.BaseHandler{

  public get(){
    this.redirect("/public/app/");
  }
}
export function getInstance()
{
  return new Index();
}
