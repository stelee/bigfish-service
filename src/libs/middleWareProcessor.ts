import baseMiddleWare=require("./baseMiddleWare");
import seqExec=require("./sequenceExecutor");
var Promise=require("promise");


export class MiddleWareProcessor
{
  private static instance:MiddleWareProcessor=null;
  middleWares:Function[]=new Array();

  public static getInstance():MiddleWareProcessor{
    if(MiddleWareProcessor.instance === null)
    {
      MiddleWareProcessor.instance = new MiddleWareProcessor();
    }
    return MiddleWareProcessor.instance;
  }

  public register(middleWare: baseMiddleWare.BaseMiddleWare)
  {
    this.middleWares.push(function(){
      return middleWare.run();
    });
  }
  public runAsPromise()
  {
    return new Promise((resolve,reject) =>
    {
      var sequenceExecutor=new seqExec.SequenceExecutor(this.middleWares);
      sequenceExecutor.execute(function(data){resolve(data)},function(error){reject(error)});
    })
  }
}
