import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

// gắn token vào request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

//xử lý khi hết lỗi 403 | accesstoken expire
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/signout")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
        try {
            const res = await api.post("/user/refresh", {}, {withCredentials: true});
            
        } catch (error) {
            
        }
    }
  },
);

export default api;
