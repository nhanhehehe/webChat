import api from "@/lib/axios"

export const userService = {
    // formData là type tiêu chuẩn của js khi upload form
    uploadAvatar: async (formData: FormData) => {
        const res = await api.post("/users/uploadAvatar", formData, {
            // backend có thể bt được file ảnh đc upload và package multer có thể đọc được file
            headers: {"Content-Type": "multipart/form-data" }
        });

        if (res.status === 400) {
            throw new Error(res.data.message);
        }

        return res.data;
    }
}