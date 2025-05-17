"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function TryCatch(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                message: "Something went wrong",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    };
}
exports.default = TryCatch;
