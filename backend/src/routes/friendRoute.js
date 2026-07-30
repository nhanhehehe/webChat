import expres from "express";
import {sendFriendRequest, getFriendRequests, acceptFriendRequest, declineFriendRequest, getAllFriends} from "../controllers/friendController.js"

const router = expres.Router();

router.post("/requests", sendFriendRequest);
router.get("/requests", getFriendRequests);

router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriends);

export default router;