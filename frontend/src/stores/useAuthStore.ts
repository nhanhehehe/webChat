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
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({loading: true});
      // goi api lấy token
      const {accessToken} = await authService.signIn(username, password);
      set({accessToken})
      await get().fetchMe();

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
}));
