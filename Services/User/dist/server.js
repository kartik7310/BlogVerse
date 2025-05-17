import express from "express";
import { mongoConnection } from "./utils/db.js";
import userRoute from "./Routes/userRoute.js";
import cors from "cors";
const app = express();
mongoConnection();
app.use(express.json());
app.use("/api/v1/user", userRoute);
app.use(cors());
app.listen(process.env.PORT, () => {
    console.log(`server is start on port ${process.env.PORT}`);
});
