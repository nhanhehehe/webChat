import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useUserStore = create<UserState>((set,get) => ({
    updateAvatarUrl: async (formData) => {
        try {
            const {user, setUser} = useAuthStore.getState();
            const data = await userService.uploadAvatar(formData);

            if (user) {
                setUser({
                    // tạo object mới, nếu chỉ điều chỉnh object cũ thì state sẽ k cập nhật
                    ...user,
                    avatarUrl: data.avatarUrl
                })
            }
        } catch (error) {
            console.error("lỗi khi updateAvatarUrl", error);
            toast.error("upload avatar không thành công!");
        }
    }
}))