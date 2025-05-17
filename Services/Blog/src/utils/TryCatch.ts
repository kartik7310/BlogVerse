import { NextFunction, Request, Response, RequestHandler } from "express";

function TryCatch(handler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}

export default TryCatch;
