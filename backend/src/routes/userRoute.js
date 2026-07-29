import express from "express";
import { getMe, testMe } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", getMe);
router.get("/test", testMe);

export default router;