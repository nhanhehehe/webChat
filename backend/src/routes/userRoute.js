import express from "express";
import { getMe } from "../controllers/userController.js";

const router = express.Router();

router.get("/getme", getMe);

export default router;