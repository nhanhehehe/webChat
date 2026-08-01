import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendShip = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    const recipientId = req.body?.recipientId ?? null;

    const memberIds = req.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "cần cung cấp recipientId hoặc memberIds" });
    }

    if (recipientId) {
      const [userA, userB] = pair(userId, recipientId);

      const friend = await Friend.findOne({ userA, userB });

      if (!friend) {
        return res.status(403).json({
          message: "chưa kết bạn với người này ",
        });
      }

      return next();
    }

    // tạo group conversation với ng đã là bạn

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(userId, memberId);
      const friend = await Friend.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const friends = await Promise.all(friendChecks);
    const notFriend = friends.filter(Boolean);

    if (notFriend.length > 0) {
      return res.status(403).json({
        message: "bạn chỉ có thể thêm bạn bè vào nhóm",
        notFriend,
      });
    }

    return next();
  } catch (error) {
    console.error("lỗi khi kiểm tra fiendship", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

export const checkGroupMembership = async (req, res, next) => {
  try {
    const {conversationId} = req.body;

    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "không tồn tại cuộc trò chuyện",
      })
    }

    const isMemeber = await conversation.participants.some((p) => {
      return p.userId.toString() === userId.toString();
    })

    if (!isMemeber) {
      return res.status(403).json({
        message: "bạn không thuộc group này",
      })
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.error("lỗi khi check membershipgroup ", error);
    return res.status(500).json({
      message: "lỗi hệ thống",
    })
  }
}
