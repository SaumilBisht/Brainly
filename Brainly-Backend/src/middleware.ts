import { Request,Response,NextFunction } from "express";
import { JWT_PASSWORD } from "./config"
import jwt  from "jsonwebtoken";
export const userMiddleware=async(req:Request,res:Response,next:NextFunction)=>
{
  const token=req.headers["authorization"];
  const decoded=jwt.verify(token as string,JWT_PASSWORD)//ts syntax

  if(decoded)
  {
    //@ts-ignore
    req.userId=decoded.id;
    next()
  }
  else 
  {
    res.status(403).json({
      message:"Token galat"
    })
  }

}