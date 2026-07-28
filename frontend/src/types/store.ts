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
    firstname: string,
    lastname: string,
  ) => Promise<void>;

  signIn: (
    username: string,
    password: string,
  ) => Promise<void>;

  logOut: () => Promise<void>;
}
