import handler = require("../libs/baseHandler");

export class Bonjour extends handler.BaseHandler
{
  public get(str)
  {
    this.out({message : str});
  }
}

export function getInstance()
{
  return new Bonjour();
}
