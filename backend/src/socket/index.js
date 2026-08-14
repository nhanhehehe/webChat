import express from "express"
import {Server} from "socket.io"
import http from "http"
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import {getUserConversationIdsForSocketIO} from "../controllers/conversationController.js"
const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
})

// verify bằng middleware
io.use(socketAuthMiddleware);

const onlineUsers = new Map(); // {userId : socket.id}

io.on("connection", async (socket) => {

    // lấy user từ socket từ middleware socket
    const user = socket.user;

    console.log(`${user.displayName} online với socket ${socket.id}`);

    // thêm vào danh sach onlone user
    onlineUsers.set(user._id, socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    const conversationId = await getUserConversationIdsForSocketIO(user._id);
    conversationId.forEach((c) => {socket.join(c)});

    // join vào room từ khi bên frontend tạo conversation mới ()
    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
    })

    // tạo phòng theo user id
    socket.join(user._id.toString());

    socket.on("disconnect", () => {

        onlineUsers.delete(user._id);
        io.emit("online-user", Array.from(onlineUsers.keys()));
        console.log("socket disconnected: ", socket.id);

    })
} )


export {io, server, app}