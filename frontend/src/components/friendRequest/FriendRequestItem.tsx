import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/UserAvatar";

interface RequestItemProps {
    // chứa thông tin hiển thị như: tên, avatar
    requestInfo: FriendRequest;
    // mô tả yêu cầu đã gửi | từ chối/accept nếu là đã nhận request
    actions: ReactNode;
    type: "sent" | "received";
}

const FriendRequestItem = ({ requestInfo, actions, type }: RequestItemProps) => {
  if (!requestInfo) {
    return;
  }
  const info = type === "sent" ? requestInfo.to : requestInfo.from;

  if (!info) {
    return;
  }

  return (
    <div className="flex items-center justify-between rounded-lg shadow-md border border-primary-foreground p-3">
      {/* bên trái: avatar, displayName, username */}
      <div className="flex items-center gap-3">
        <UserAvatar
          type="sidebar"
          name={info.displayName}
        />
        <div>
          <p className="font-medium">{info.displayName}</p>
          <p className="text-sm text-muted-foreground">@{info.username}</p>
        </div>
      </div>
      {/* bên phải */}
      {actions}
    </div>
  );
};

export default FriendRequestItem;