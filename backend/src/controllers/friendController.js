export const sendFriendRequest = (req, res) => {
    try {
    
    } catch (error) {
        console.log("lỗi khi gửi yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const getFriendRequests = (req, res) => {
    try {
        
    } catch (error) {
        console.log("lỗi khi lấy danh sách yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const acceptFriendRequest = (req, res) => {
    try {
        
    } catch (error) {
        console.log("lỗi khi chấo nhận yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const declineFriendRequest = (req, res) => {
    try {
        
    } catch (error) {
        console.log("lỗi khi từ chối yêu cầu kết bạn", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const getAllFriends = (req, res) => {
    try {
        
    } catch (error) {
        console.log("lỗi khi lấy danh sách bạn bè", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}