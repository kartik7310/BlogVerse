import dotenv from 'dotenv';
dotenv.config();
import blogRoute from "./Routes/blogRoute.js"
import express from "express";
import { sql } from "./config/db.js"; 
import { connectionRabbitMQ } from './utils/rabitMQ.js';
import cors from "cors" 
const app = express();
const frontend_Url = process.env.Frontend_Url;

app.use(
  cors({
    origin:frontend_Url,          // front-end origin
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials: true                         // if you set cookies
  })
);
app.use(express.json());

app.use("/api/v1",blogRoute)
async function initDb() {
  // BLOGS ----------------------------------------------------
  await sql`CREATE TABLE IF NOT EXISTS blogs (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      blogContent TEXT        NOT NULL,
      image       VARCHAR(255),
      author      VARCHAR(255) NOT NULL,
      category       VARCHAR(100),   
      createdAt  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
  )`;

  // COMMENTS -------------------------------------------------
  await sql`CREATE TABLE IF NOT EXISTS comments (
      id         SERIAL PRIMARY KEY,
      comment    TEXT        NOT NULL,
      userId    VARCHAR(255)     NOT NULL,
      userName  VARCHAR(255) NOT NULL,
      blogId    VARCHAR(255)     NOT NULL,
      createdAt TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
  )`;

  // savedBlogs ----------------------------------------------------
  await sql`CREATE TABLE IF NOT EXISTS savedBlogs (
      id         SERIAL PRIMARY KEY,
      userId    VARCHAR(255)   NOT NULL,
      blogId    VARCHAR(255)   NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;





  console.log('📦  Database initialised successfully');
}
(async () => {
  try {
    await initDb();
     connectionRabbitMQ()
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`🚀  Server started on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌  Unable to start server:', err);
    process.exit(1);
  }
})();
