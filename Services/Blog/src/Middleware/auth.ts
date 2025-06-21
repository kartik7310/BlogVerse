import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

 interface IUser extends Document {
  id:string;
  name: string;
  email: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
}

  export interface authenticateRequest extends Request{
  user?: IUser | null;
  name?:string|null

}
export async function auth(
  req: authenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
         res.status(401).json({ message: "Please login - No auth header" });
    return;
    }
   const token = authHeader.split(" ")[1]
   const decodeValue = jwt.verify(token,process.env.SECRETE_JWT as string) as JwtPayload
  
   console.log("jwt object is here",decodeValue);
   
   if(!decodeValue){
res.status(401).json({ message: "Invalid token" });
return ;
   }
   req.user = decodeValue.id;
   req.name = decodeValue.username
   

   
   next()
  } catch (error) {
    console.error("jwt verification error", error);
  }
}
