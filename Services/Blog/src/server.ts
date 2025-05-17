import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createClient } from "redis";
import blogRoute from "./Routes/blogRoute";
const app = express();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient
  .connect()
  .then(() => console.log("redis connected successfully"))
  .catch(() => console.log("redis connection failed"));

app.use(express.json());
app.use("/api/v1", blogRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is start on port ${process.env.PORT}`);
});
