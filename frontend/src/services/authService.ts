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

  logOut: async () => {
    return api.post("/auth/logout", {}, {withCredentials: true});
  }
};
