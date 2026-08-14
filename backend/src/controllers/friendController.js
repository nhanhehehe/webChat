import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
    try {
        // id người nhận và tin nhắn yêu cầu kết bạn
        const {to, message} = req.body;

        // id của người gửi từ jwt
        const from = req.user._id;

        // kiểm tra người gửi và người nhận khác nhau
        if (from.toString() === to.toString()) {
            return res.status(400).json({
                message: "không thể gửi yêu cầu kết bạn cho chính mình",
            })
        }

        // kiểm tra người nhận có tồn tại
        const userExists = await User.exists({"_id": to});
        if (!userExists) {
            return res.status(400).json({
                message: "không tìm thấy user",
            })
        }

        // quy ước userA và userB theo nghiệp vụ friendRequest
        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        // kiểm tra "ĐÃ" tồn tại bạn bè || tồn tại yêu cầu kết bạn
        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({userA, userB}),
            FriendRequest.findOne({
                $or: [
                    {from, to},
                    {from: to, to: from}
                ]
            })
        ]);

        if (alreadyFriend) {
            return res.status(400).json({
                message: "hai người đã là bạn bè",
            })
        }

        if (existingRequest) {
            return res.status(400).json({
                message: "Đã có lời mời kết bạn đang chờ",
            })
        }

        const request = await FriendRequest.create({
            from,
            to,
            message
        })

        return res.status(201).json({
            message: "gửi lời mời kết bạn thành công",
            request,
        })


    } catch (error) {
        console.log("lỗi khi gửi yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const populateFields = "_id username displayName avatarUrl";

        const [sent, received] = await Promise.all([
            await FriendRequest.find({from: userId}).populate("to", populateFields).lean(),
            await FriendRequest.find({to: userId}).populate("from", populateFields).lean()
        ])

        return res.status(200).json({sent, received}); 

    } catch (error) {
        console.log("lỗi khi lấy danh sách yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        // lấy id request từ param của path và user id người nhận từ req (jwt)
        const {requestId} = req.params;
        const userId = req.user._id;

        //kiểm tra có tồn tại request khôgn
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(400).json({
                message: "không tìm thấy lời mời kết bạn",
            })
        }

        // kiểm tra người gửi kết bạn và user có phải là cùng một người
        if (request.to.toString() !== userId.toString()) {
            return res.status(400).json({
                message: "bạn không có quyền chấp nhận lời mời này",
            })
        }

       
        // tạo bạn bè mới 
        const friend = await Friend.create({
            userA: request.from,
            userB: request.to,
        })

        // xóa request kết bạn sau khi tạo bạn 
            await FriendRequest.findByIdAndDelete(requestId);

        // lấy user người gửi từ request, lấy thông tin để hiển thị
        const from = await User.findById(request.from).select("_id displayName avatarUrl").lean();


        return res.status(200).json({
                message: "chấp nhận lời mời kết bạn thành công",
                newFriend: {
                    _id: from?._id,
                    displayName: from?.displayName,
                    avatarUrl: from?.avatarUrl,
                }
            })

    } catch (error) {
        console.log("lỗi khi chấp nhận yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        // tìm request có tồn tại 
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "không tìm thấy lời mời kết bạn",
            })
        }

        //kiểm tra người được gửi yêu cầu kết bạn và user có phải là một không
        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "bạn không có quyền từ chối lời mời này",
            })
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.sendStatus(204);

    } catch (error) {
        console.log("lỗi khi từ chối yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const getAllFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendShips = await Friend.find({
            $or: [
                {userA: userId}, {userB: userId},
            ]
        })
        .populate("userA", " displayName avatarUrl _id username")
        .populate("userB", " displayName avatarUrl _id username")
        .lean();

        if (!friendShips.length) {
            return res.satus(200).json({
                message: "không có bạn bè",
            })
        } 

        const friends = friendShips.map((f) => {
            return f.userA._id.toString() === userId.toString() ? f.userB : f.userA;
        })

        return res.status(200).json({
            message: "lấy danh sách bạn bè thành công",
            friends,
        })


    } catch (error) {
        console.log("lỗi khi lấy danh sách bạn bè", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}