import mongoose from "mongoose";

export const connect = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("liên kết thành công db");
    } catch (error) {
        console.log('lỗi khi kết nối db', error);
        process.exit(1);
    }
}