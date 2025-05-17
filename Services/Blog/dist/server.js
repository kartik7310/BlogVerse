"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const blogRoute_1 = __importDefault(require("./Routes/blogRoute"));
const app = (0, express_1.default)();
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
exports.redisClient
    .connect()
    .then(() => console.log("redis connected successfully"))
    .catch(() => console.log("redis connection failed"));
app.use(express_1.default.json());
app.use("/api/v1", blogRoute_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server is start on port ${process.env.PORT}`);
});
