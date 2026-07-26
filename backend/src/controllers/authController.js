import User from "../models/User";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {

    try {
        const {username, password, email, firstName, lastName} = req.body;

        //required?
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "không thể thiếu username, password, email, firstName, lastName"
            });
        }

        // username exist?
        const duplicateUsername = await User.findOne({username});

        if (duplicateUsername) {
            return res.status(409).json({message: "username đã tồn tại"});
        }

        // hash password
        const hashedPassword = bycript.hash(password, 10); // salt = 10 - trộn 2 mũ 10 lần 

        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });

        //return 
        return res.sendStatus(204);


    } catch (error) {
        console.log("lỗi khi signUp", error);
        return res.status(500).json({
            message: "lỗi hệ thống",
        })
    }
};