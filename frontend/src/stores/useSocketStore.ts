import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";

const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set,get) => ({
    onlineUsers: [],
    socket: null,
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if (existingSocket) return; // tránh tạo quá nhiều

        const socket: Socket = io(baseURL, {
            auth: {token: accessToken},
            transports: ["websocket"],
        });

        set({socket: socket});

        socket.on("connect", () => {
            console.log("đã kết nối với socket")
        })

        // online users
        // sau khi connect socket từ backend thì lắng nghe sự kiện online user từ backend
        socket.on("online-users", (userIds) => {
            set({onlineUsers: userIds})
        })

        //lắng nghe sự kiện new message
        socket.on("new-message", ({message, conversation, unreadCounts}) => {
            useChatStore.getState().addMessage(message);

            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId,
                    displayName: "",
                    avatarUrl: null,
                }
            };

            const updatedConversation = {
                ...conversation,
                lastMessage,
                unreadCounts,
            };

            // khi user mở conversation thì đánh dấu đã đọc
            if (useChatStore.getState().activeConversationId === message.conversationId) {
                //todo: đánh dấu đã đọc
                //khi có tin nhắn mới trong cuộc hội thoại đang mở, mark as seen tin nhắn đó
                useChatStore.getState().markAsSeen();
            }

            // cập nhật thông tin của conversation mới
            useChatStore.getState().updateConversation(updatedConversation);
        })

        //read message
        socket.on("read-message", ({conversation, lastMessage}) => {
            // chứa những thông tin cần cập nhật của conversation
            // chấp vá do type frontend và backend không khớp
            const updated = {
                _id: conversation._id,
                lastMessage,
                lastMessageAt: conversation.lastMessageAt,
                unreadCounts: conversation.unreadCounts,
                seenBy: conversation.seenBy,
            }

            useChatStore.getState().updateConversation(updated);
        })

        // new group chat, cập nhật store mới, ui update hiển thị group chat mới
        socket.on("new-group", (conversation) => {
            useChatStore.getState().addConvo(conversation);
            // tin nhắn mới
            socket.emit("join-conversation", conversation._id);
        })
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({socket: null});
        }
    }

}))