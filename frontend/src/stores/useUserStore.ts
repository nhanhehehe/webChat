import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

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

            // cập nhật chat store để đồng bộ avatar khi group chat lấy avatar từ từng participants trong convo
            useChatStore.getState().fetchConversations();
        } catch (error) {
            console.error("lỗi khi updateAvatarUrl", error);
            toast.error("upload avatar không thành công!");
        }
    }
}))