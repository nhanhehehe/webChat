import express from "express";
import {
  getMe,
  searchUserByUsername,
  testMe,
  uploadAvatar,
} from "../controllers/userController.js";
import {upload} from "../middlewares/uploadMiddleware.js"
const router = express.Router();

router.get("/me", getMe);
router.get("/test", testMe);
router.get("/search", searchUserByUsername);
// middleware sẽ tìm trường có tên là file trong request body, đọc file đó vào ram theo cấu hình, gán dữ liệu thô của file vào request.file trước khi chuyển tới controllers
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export default router;
