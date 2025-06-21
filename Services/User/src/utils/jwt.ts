import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
export const generateToken = (payload: {id:string,username:string}) => {
  const secret = process.env.SECRETE_JWT!;
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};
