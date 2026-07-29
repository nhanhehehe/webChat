
export const getMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            user,
        })
        
    } catch (error) {
        console.error("lỗi lấy thông tin user", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}

export const testMe = async (req, res) => {
    try {
        res.sendStatus(204);
    } catch (error) {
        console.error("lỗi khi test", error);
        return res.status(500).json({
            message: "lỗi hệ thống"
        })
    }
}