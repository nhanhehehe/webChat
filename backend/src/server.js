import express from "express";
import dotevn from "dotenv";
import { connect } from "./libs/db";

dotevn.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());

connect().then(() => {
    app.listen(PORT, () => {
        console.log(`server bắt đầu chạy trên cổng ${PORT}`)
    });
})




