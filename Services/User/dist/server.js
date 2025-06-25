import express from "express";
import { mongoConnection } from "./utils/db.js";
import userRoute from "./Routes/userRoute.js";
import cors from "cors";
const app = express();
const frontend_Url = process.env.Frontend_Url;
mongoConnection();
app.use(express.json());
app.use(cors({
    origin: frontend_Url, // front-end origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true // if you set cookies
}));
app.use("/api/v1/user", userRoute);
app.listen(process.env.PORT, () => {
    console.log(`server is start on port ${process.env.PORT}`);
});
