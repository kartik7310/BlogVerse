import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express from "express";
import { createClient } from "redis";
import blogRoute from "./Routes/blogRoute";
import { startCacheConsumer } from "./utils/Consumer";
const app = express();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient
  .connect()
  .then(() => console.log("redis connected successfully"))
  .catch(() => console.log("redis connection failed"));

  startCacheConsumer()
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",          // front-end origin
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials: true                         // if you set cookies
  })
);
app.use("/api/v1", blogRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is start on port hi ${process.env.PORT}`);
});
