import n=require("./null");

export function getValue(target,path):any{
  var pathArr=path.split(".");
  var object=target;
  if(n.isNull(object))
  {
    return null;
  }
  for(var i=0;i<pathArr.length;i++){
    var objName=pathArr[i];
    object=object[objName];
    if(n.isNull(object)){
      return null;
    }
  }
  return object;
}

export function setValue(target,path,value):boolean{
  var pathArr=path.split(".");
  var object=target;
  if(n.isNull(object))
  {
    return false;
  }
  var i=0;
  for(;i<pathArr.length-1;i++)
  {
    var objName=pathArr[i];
    if('undefined'==typeof(object[objName])){
      object[objName]=new Object();
    }
    object=object[objName];
  }
  var objName=pathArr[i];
  object[objName]=value;
  return true;
}

export function path(target,path,value=undefined){
  if('undefined' == typeof(value)){
    return getValue(target,path);
  }else{
    return setValue(target,path,value);
  }
}
export function walk(obj,decoratorFn){
  for(var prop in obj)
  {
    if(!obj.hasOwnProperty(prop))
    {
      continue;
    }
    if(typeof obj[prop] === "object")
    {
      walk(obj[prop],decoratorFn);
    }else
    {
      obj[prop]=decoratorFn(obj[prop]);
    }
  }
}
