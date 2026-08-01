import express from "express"
import { sendDirectMessage, sendGroupMessage } from "../controllers/messageController.js";
import { checkFriendShip, checkGroupMembership } from "../middlewares/friendMiddleware.js";

const router = express.Router();

//vì chỉ sài trong phần message nên không cần truyền middleware trong server
router.post("/direct", checkFriendShip ,sendDirectMessage);
router.post("/group", checkGroupMembership, sendGroupMessage);

export default router;