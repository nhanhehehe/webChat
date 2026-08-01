import type { User } from "./user";

export interface authState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  
  setAccessToken: (token: string) => void;

  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;

  signIn: (
    username: string,
    password: string,
  ) => Promise<void>;

  signOut: () => Promise<void>;

  fetchMe: () => Promise<void>;

  refreshMe: () => Promise<void>;

  teshMe: () => Promise<void>;
}
