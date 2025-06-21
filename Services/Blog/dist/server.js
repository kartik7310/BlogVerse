"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const blogRoute_1 = __importDefault(require("./Routes/blogRoute"));
const Consumer_1 = require("./utils/Consumer");
const app = (0, express_1.default)();
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
exports.redisClient
    .connect()
    .then(() => console.log("redis connected successfully"))
    .catch(() => console.log("redis connection failed"));
(0, Consumer_1.startCacheConsumer)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // front-end origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true // if you set cookies
}));
app.use("/api/v1", blogRoute_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server is start on port hi ${process.env.PORT}`);
});
