import handler = require("../libs/baseHandler");
import main=require("../service");

import path=require('path');
import fs=require('fs');

export class Public extends handler.BaseHandler{
  www_folder:String;
  constructor()
  {
    super();
    this.www_folder=fs.realpathSync(main.Main.App.getInstance().config["appConfig"]["www"]['path']); //specified for the web-client project
  }
  public get(pathname:string){
    pathname=this.www_folder + "/" + pathname;
    if(path.extname(pathname) == "")
    {
        pathname += "/";
    }
    if(pathname.charAt(pathname.length-1) == "/")
    {
      pathname+="index.html";
    }
    fs.exists(pathname,(exists)=>
    {
      if(exists){
        switch(path.extname(pathname)){
                case ".html":
                    this.response.writeHead(200, {"Content-Type": "text/html"});
                    break;
                case ".js":
                    this.response.writeHead(200, {"Content-Type": "text/javascript"});
                    break;
                case ".css":
                    this.response.writeHead(200, {"Content-Type": "text/css"});
                    break;
                case ".gif":
                    this.response.writeHead(200, {"Content-Type": "image/gif"});
                    break;
                case ".jpg":
                    this.response.writeHead(200, {"Content-Type": "image/jpeg"});
                    break;
                case ".png":
                    this.response.writeHead(200, {"Content-Type": "image/png"});
                    break;
                default:
                    this.response.writeHead(200, {"Content-Type": "application/octet-stream"});
        }
        fs.readFile(pathname,(err,data)=>
        {
          this.response.end(data);
        })
      }else
      {
        this.response.writeHead(404, {"Content-Type": "text/html"});
        this.response.end("<h1>404 Not Found</h1>");
      }
    })
  }
}
export function getInstance()
{
  return new Public();
}
