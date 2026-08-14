import { authService } from "@/services/authService";
import type { authState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";
export const useAuthStore = create<authState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setUser: (user) => {
        set({user});
      },

      setAccessToken: (token) => {
        set({accessToken: token})
      },

      clearState: () => {
        set({accessToken: null, user: null, loading: false });
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
      },

      signUp: async (username, password, firstName, lastName, email) => {
        try {
          set({ loading: true });
          // gọi api trong lớp service

          await authService.signUp(username, password, email, firstName, lastName);

          toast.success("đăng ký thành công! Bạn đã chuyển sang đăng nhập. ");
        } catch (error) {
          console.error(error);
          toast.error("đăng ký không thành công");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          get().clearState();
          set({loading: true});
          // đảm bảo kh lấy dữ liệu cũ
          localStorage.clear();

          // xóa conversation khi đăng nhập
          useChatStore.getState().reset();

          // goi api lấy token
          const {accessToken} = await authService.signIn(username, password);
          set({accessToken})

          // lấy thông tin user sau khi login
          await get().fetchMe();

          // lấy thông tin conversation khi đã login(có userId)
          // sau đó persist lưu conversations vào t
          useChatStore.getState().fetchConversations();

          toast.success("Chào mừng quay trở lại với Moji");

          
          
        } catch (error) {
          console.error(error);
          toast.error("đăng nhập không thành công");
        } finally {
          set({loading: false})
        }
      },

      signOut: async () => {
        
        try {
          get().clearState();
          await authService.signOut();

          // xóa user khi đăng xuấy
          localStorage.clear();
          // xóa conversation khi đăng xuất
          useChatStore.getState().reset();

          toast.success("logout thành công")
        } catch (error) {
            console.error(error);
            toast.error("lỗi khi logout. Hãy thử lại");
        }
      },

      fetchMe: async () => {
        try {
          set({loading: true});
          const user = await authService.fetchMe();
          set({user})

        } catch (error) {
          console.error(error);
          set({user: null, accessToken: null});
          toast.error("lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({loading: false});
        }
      },

      refreshMe: async () => {
        try {
          set({loading: true});
          const accessToken = await authService.refreshMe();

          set({accessToken});

          // vì khi refresh trang, user bị mất nên cần fetch lại 
          if (!get().user) {
            await get().fetchMe();
          }
        } catch (error) {
          console.error(error);
          toast.error("token đã hết hạn hoặc không hợp lệ!");
          get().clearState();
        } finally {
          set({loading: false})
        }
      },

      teshMe: async() => {
        try {
          await authService.testMe();
          toast.success("test thành công");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi khi test");
        } 
      }
    }),{
      name: "auth-storage",
      partialize: (state) => ({user: state.user}) // chỉ persist user 
    }
  )
);
