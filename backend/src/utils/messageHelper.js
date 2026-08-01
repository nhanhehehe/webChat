export const updateConversationAfterCreateMessage = (conversation, message, senderId) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt,

        }
    })

    conversation.participants.forEach(p=> {
        const memberId = p.userId.toString();
        const isSender = senderId.toString() === memberId;
        const preCount = conversation.unreadCounts.get(memberId) || 0;

        // người gửi thì không tính, những người khác sẽ tính là chưa đọc +1 cho
        conversation.unreadCounts.set(memberId, isSender ? 0 : preCount + 1);
    })

    //
}