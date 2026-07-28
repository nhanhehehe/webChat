import { authService } from "@/services/authService";
import type { authState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
export const useAuthStore = create<authState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (token) => {
    set({accessToken: token})
  },

  clearState: () => {
    set({accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, firstname, lastname, email) => {
    try {
      set({ loading: true });
      // gọi api trong lớp service

      await authService.signUp(username, password, email, firstname, lastname);

      toast.success("đăng ký thành công! Bạn đã chuyển sang đăng nhập. ");
    } catch (error) {
      console.error(error);
      toast.error("đăng ký không thành công");
    } finally {
      set({ loading: true });
    }
  },

  signIn: async (username, password) => {
    try {
      set({loading: true});
      // goi api lấy token
      const token = await authService.signIn(username, password);
      get().setAccessToken(token);

      toast.success("Chào mừng quay trở lại với Moji");
      
    } catch (error) {
      console.error(error);
      toast.error("đăng nhập không thành công");
    } finally {
      set({loading: false})
    }
  },

  logOut: async () => {
    
    try {
      get().clearState();
      await authService.logOut();

      toast.success("logout thành công")
    } catch (error) {
        console.error(error);
        toast.error("lỗi khi logout. Hãy thử lại");
    }
  },
}));
