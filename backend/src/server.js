import express from "express";
import dotevn from "dotenv";

dotevn.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server bắt đầu chạy trên cổng ${PORT}`)
})


