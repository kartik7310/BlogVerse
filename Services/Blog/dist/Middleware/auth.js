"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "Please login - No auth header" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodeValue = jsonwebtoken_1.default.verify(token, process.env.SECRETE_JWT);
        console.log("jwt object is here", decodeValue);
        if (!decodeValue) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = decodeValue.id;
        req.name = decodeValue.username;
        next();
    }
    catch (error) {
        console.error("jwt verification error", error);
    }
}
