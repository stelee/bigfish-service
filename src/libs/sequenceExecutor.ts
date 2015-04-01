export class SequenceExecutor{
  fnIndex:number ;
  fnArray:Function[];
  data:any[];
  owner:any;
  constructor(fnArray:Function[],owner:any=null)
  {
    this.fnIndex=0;
    this.fnArray=fnArray;
    this.data=new Array();
    if(owner != null)
    {
      this.owner = owner;
    }else
    {
      this.owner=this;
    }
  }
  public execute(onFinished,onError)
  {
    if(this.fnIndex >= this.fnArray.length)
    {
      onFinished(this.data);
    }else
    {
      this.fnArray[this.fnIndex].apply(this.owner,this.data).then((result) =>
      {
        this.fnIndex ++ ;
        this.data.push(result);
        this.execute(onFinished,onError)
      })
      .catch((err)=>
      {
        onError(err);
      });
    }
  }
}
