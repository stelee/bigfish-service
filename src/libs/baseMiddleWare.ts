export interface BaseMiddleWare
{
  run():Promise<any>;
}
