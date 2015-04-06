export function isNull(obj)
{
  if(typeof(obj)==='undefined')
  {
      return true;
  }
  if(obj===null)
  {
      return true;
  }
  return false;
}
export function isEmpty(obj)
{
  if(obj === "" || JSON.stringify(obj) === '{}')
  {
    return true;
  }
  return isNull(obj);
}
export function isNotNull=function(obj)
{
    return !isNull(obj);
}
export function isNotEmpty=function(obj)
{
    return !isEmpty(obj);
}
