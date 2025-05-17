import express from "express";
import { login } from "../Controllers/user.js";
const router = express.Router();
router.post("/", login);
export default router;
