import express from "express";
import dotenv from "dotenv";
import { connect } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js"
import userRoute from "./routes/userRoute.js";
import cors from "cors"
import friendRoute from "./routes/friendRoute.js"
import messageRoute from "./routes/messageRoute.js"
import conversationRoute from "./routes/conversationRouter.js"
import swaggerUi from 'swagger-ui-express'
import fs from "fs"
import {app, server} from "./socket/index.js"
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

const PORT = process.env.PORT || 5001;

//middlewares: express đọc request body từ frontend -> lấy qua req.body
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true} ))

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// swagger
// const swaggerDocument = JSON.parse(fs.readFileSync("", "utf8"))

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// http://localhost:5173 thay vao phan base_url

//public routes
app.use("/api/auth", authRoute);

//private routes 
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute)


connect().then(() => {
    server.listen(PORT, () => {
        console.log(`server bắt đầu chạy trên cổng ${PORT}`)
    });
})




