
// 3 truowngf hojwp khi find conversationId active
// + kh cos: welcome page; +loading: skeleton; +cos: chatInset: gom
                                                      // + header
                                                      // + body 

import { useChatStore } from "@/stores/useChatStore"
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import { SidebarInset } from "../ui/sidebar";
import { useEffect } from "react";

                                                      // + footer
const ChatWindowLayout = () => {
  const {activeConversationId, conversations, messageLoading: loading, markAsSeen } = useChatStore();
  const selectedConvo = conversations.find((c) => (c._id === activeConversationId));

  //khi user mở một cuộc hội thoại, nếu có tin nhắn chưa đọc thì mark as seen
  useEffect(() => {
    if (!selectedConvo) {
      return;
    }

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch ( error) {
        console.error("lỗi khi markSeen",error);
      }
    }

    markSeen();
  }, [markAsSeen, selectedConvo])

  if (!selectedConvo) {
    return <ChatWelcomeScreen/>
  }

  if (loading) {
    return <ChatWindowSkeleton />
  }

  

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindowBody />
      </div>

      {/* Footer */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
}

export default ChatWindowLayout