export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}
// to và from optional vì với received chỉ lấy từ from và sent thì lấy từ to
export interface FriendRequest {
  _id: string;
  from?: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  to?: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}
