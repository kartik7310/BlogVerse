import { NextFunction, Request, Response, RequestHandler } from "express";

function TryCatch(handler: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.error("Caught error in TryCatch:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
}


export default TryCatch;
