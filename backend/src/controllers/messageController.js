import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import {updateConversationAfterCreateMessage} from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
    
    try {
        // {recipient, content, conversationId}
        // senderId
        const {recipientId, content, conversationId} = req.body;

        const senderId = req.user._id;
        
        // kiểm tra có content không
        if (!content) {
            return res.status(404).json({
                messsage: "không có tin nhắn",
            })
        }
        // tao bien conversation
        let conversation;

        // kiểm tra không có conversation từ conversationId thì tạo mới conversation
        conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    {userId: senderId, joinedAt: Date.now(),},
                    {userId: recipientId, joinedAt: Date.now(),}
                ],
                lastMessageAt: Date.now(),
                unreadCounts: new Map(),
            })
        }

        // tao message gòm senderId, content, conversationId
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
        })

        //dung message helper    
        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({message});
    } catch (error) {
        console.error("lỗi khi gửi tin nhắn trực tiếp", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }


}

export const sendGroupMessage = async (req, res) => {
    //xác thức người gửi có phải thành viên trong nhóm + không tạo mới nhóm khi không có như direct
    //tạo middleware xác thực 
    try {
        const {conversationId, content} = req.body;
        const senderId = req.user._id;

        // middleware truyền
        const conversation = req.conversation;

        if(!content) {
            return res.status(400).json({
                message: "thiếu nội dung",
            })
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content,
        })

        updateConversationAfterCreateMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({
            message,
        })
    } catch (error) {
        console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}






