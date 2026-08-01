import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type !== "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res.status(400).json({
        message: "bắt buộc có tên nhóm và danh sách thành viên",
      });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = await Conversation.create({
        type: "group",
        participants: [{ userId }, ...memberIds.map((m) => ({ userId: m }))],
        group: {
          name: name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });
    }

    if (!conversation) {
      return res.status(404).json({
        message: "thể loại trò chuyện không phù hợp",
      });
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    return res.status(201).json({
      conversation,
    });
  } catch (error) {
    console.error("lỗi khi tạo cuộc hội thoại", error);
    return res.status(500).json({
      message: "lỗi hệ thống",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      });

    // format dữ liệu cho frontend
    const formatted = conversations.map((convo) => {
      const participants = (convo.participants || []).map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        // nếu không có avatar thì null thay vì undefined
        avatarUrl: p.userId?.avatarUrl ?? null,
      }));

      return {
        // chuyền từ mongoose document sang js object gồm các field có trong schema(_id, type, participants)
        ...convo.toObject(),
        unreadCounts: convo.unreadCounts || {},
        participants,
      };
    });

    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.error("lỗi khi lấy conversations", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};
// lấy tin nhắn của cuộc hội thoại + pagination (conversation có thể vài ngàn tin nhắn -> query sẽ chậm )
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;

    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await MessageChannel.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
