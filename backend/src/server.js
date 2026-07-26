import express from "express";
import dotenv from "dotenv";
import { connect } from "./libs/db.js";
import authRoute from "./routes/authRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares: express đọc request body từ frontend -> lấy qua req.body
app.use(express.json());

//public routes
app.use("/api/auth", authRoute)

//private routes 


connect().then(() => {
    app.listen(PORT, () => {
        console.log(`server bắt đầu chạy trên cổng ${PORT}`)
    });
})




