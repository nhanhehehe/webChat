import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    lastName: string,
    firstName: string,
    email: string,
  ) => {
    const response = await api.post(
      "auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true },
    );

    return response.data;
  },

  signIn: async (username: string, password: string) => {
    const response = await api.post(
      "/auth/signin",
      { username, password },
      { withCredentials: true },
    );

    return response.data;
  },

  signOut: async () => {
    return api.post("/auth/signout", {}, {withCredentials: true});
  },

  fetchMe: async () => {
    const response = await api.get("/user/me", {withCredentials: true});

    return response.data.user;
  },

  refreshMe: async () => {
    const response = await api.post("auth/refresh", {withCredentials: true});

    return response.data.accessToken;
  },

  testMe: async () => {
    const response = await api.get("/user/test", {withCredentials: true});

    return response.data.status;
  }
};
