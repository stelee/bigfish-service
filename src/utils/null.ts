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
export function isNotNull(obj)
{
    return !isNull(obj);
}
export function isNotEmpty(obj)
{
    return !isEmpty(obj);
}
