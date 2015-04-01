export class Logger
  {
    private static instance:Logger=null;

    public static getInstance():Logger
    {
      if(Logger.instance===null)
      {
        Logger.instance=new Logger();
      }
      return Logger.instance;
    }

    public info(val:any)
    {
      console.log("INFO:"+val);
    }
    public debug(val:any)
    {
      console.log("DEBUG:"+val);
    }
    public warning(val:any)
    {
      console.log("WARNING:"+val);
    }
  };
