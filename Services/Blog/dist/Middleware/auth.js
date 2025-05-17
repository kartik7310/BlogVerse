"use strict";
// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { IUser } from "../Model/user.js";
Object.defineProperty(exports, "__esModule", { value: true });
//   export interface authenticateRequest extends Request{
//   user?: IUser | null
// }
// export async function auth(
//   req: authenticateRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//          res.status(401).json({ message: "Please login - No auth header" });
//     return;
//     }
//    const token = authHeader.split(" ")[1]
//    const decodeValue = jwt.verify(token,process.env.SECRETE_JWT as string) as JwtPayload
//    console.log(decodeValue);
//    if(!decodeValue){
// res.status(401).json({ message: "Invalid token" });
// return ;
//    }
//    req.user = decodeValue.id;
//    next()
//   } catch (error) {
//     console.error("jwt verification error", error);
//   }
// }
