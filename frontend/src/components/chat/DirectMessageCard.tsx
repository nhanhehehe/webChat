import type { Conversation } from "@/types/chat"
import ChatCard from "./ChatCard"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";


const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();
    const {onlineUsers} = useSocketStore();

    if (!user) return null;
    const otherUser = convo.participants.find((p) => p._id !== user._id);

    if (!otherUser) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";

    // hàm handle khi ng dùng click vào một conversation -> id convo active -> fetch messages của convo
    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        // fetch message từ conversation id mà user click (active=true)
        if (!messages[id]) {
            // tại sao k truyền conversationId
            await fetchMessages();
        }


    }

    return <ChatCard
        convoId={convo._id}
        name={otherUser.displayName ?? ""}
        // tai sao kh lay luon lastMessageAt nhi? 
        timestamps={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
        isActive={convo._id === activeConversationId}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
            <>
                <UserAvatar 
                    type="sidebar" 
                    name={otherUser.displayName ?? ""} 
                    avatarUrl={otherUser.avatarUrl ?? undefined} 
                />
                {/* todo: socket io */}
                <StatusBadge status={onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"}/>
                {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/> }
            </>
        }
        subtitle={
            <p
                className={cn("text-sm truncate", unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}
            >
                {lastMessage}
            </p>
        }
    />
}

export default DirectMessageCard