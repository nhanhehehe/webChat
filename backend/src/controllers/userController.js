import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";

export const getMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            user,
        })
        
    } catch (error) {
        console.error("lỗi lấy thông tin user", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const testMe = async (req, res) => {
    try {
        res.sendStatus(204);
    } catch (error) {
        console.error("lỗi khi test", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const searchUserByUsername = async (req,res) => {
    try {
        const {username} = req.query;

        if (!username || username.trim() === "") {
            return res.status(400).json({message: "cần cung cấp username trong query"})
        }

        const user = await User.findOne({username}).select("_id displayName username avatarUrl")

        return res.status(200).json({user})

    } catch (error) {
        console.error("lỗi khi searchUserByUsername", error);
        return res.status(500).json({message: "lỗi hệ thống"})
    }
}


export const uploadAvatar = async (req, res) => {
    try {
        // lấy file từ request, req.file do middleware cung cấp
        const file = req.file
        const userId = req.user._id;

        if (!file) {
            return res.status(400).json({message: "no file uploaded!"});
        }

        // file.buffer là dữ liệu ảnh do multer lưu trong bộ nhớ
        // sau khi upload ảnh, result sẽ chứa link mới và id của anh trên cloudinary
        const result = await uploadImageFromBuffer(file.buffer);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            // upload 2 trường:
            avatarUrl: result.secure_url,
            avatarId: result.public_id,
        }, {
            // options: new = true để trả về user đã đc cập nhật
            new: true
        }).select("avatarUrl");

        if (!updatedUser.avatarUrl) {
            return res.status(400).json({message: "avatar trả về null"})
        }

        return res.status(200).json({avatarUrl: updatedUser.avatarUrl});

    } catch (error) {
        console.error("lỗi xảy ra khi upload avatar ", error);
        return res.status(500).json({message: "avatar upload fail"});
    }
}