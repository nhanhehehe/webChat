import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import MessageItem from "./MessageItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component"


const ChatWindowBody = () => {
  const {
      activeConversationId,
      conversations,
      messages: allMessages,
      fetchMessages
  } = useChatStore();

  // kiểm tra tin đã đọc hay chưa 
  const [lastMessageStatus, setLastMessageStatus] = useState<"delivered" | "seen">("delivered");

  // activeConversationId! để không bị warn đỏ; vì render component này thì chắc chắn phải có prop activeConvoId này
  const messages = allMessages[activeConversationId!]?.items ?? [];
  // tìm convo đang active dựa trên convo active id
  const selectedConvo = conversations.find((c) => c._id === activeConversationId);
  const key = `chat-scroll-${activeConversationId}`;

  //hasMore
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;

  //ref
  const messageEndRef = useRef<HTMLDivElement>(null); 
  const containerRef = useRef<HTMLDivElement>(null);

  const reversedMessages = [...messages].reverse();
  

  

  // cập nhật last message status
  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;
    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConvo?.seenBy ?? [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConvo]);

  useLayoutEffect(() => {
    if (!messageEndRef.current) {
      return;
    }

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      // vị trí hiện thị của element trong viewpoint của thẻ cha
      block: "end"
    })
  }, [activeConversationId])

  const fetchMoreMessages = async () => {

    if (!activeConversationId) {
      return;
    }

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error("lỗi khi fetch more messages", error)
    }
  }

  const handleScrollSave = () => {
    const container = containerRef.current;

    if (!container || !activeConversationId) {
      return; 
    }

    
    // lưu trong session vì tắt tab sẽ mất session liền
    sessionStorage.setItem(key, JSON.stringify({
      // vị trí hiện tại
      scrollTop: container.scrollTop,
      // tổng chiều cao có thể cuộn (phục vụ debug)
      scrollHeight: container.scrollHeight
    }))
  }

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const item = sessionStorage.getItem(key);

    if (item) {
      const {scrollTop} = JSON.parse(item);
      // browser chạy một callback trước khi paint ui frame tiếp theo
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      })
    }
  }, [messages.length])

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (!messages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground ">
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }


  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar"
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
      >
        {/* cột mốc để cuộn xuống tin nhắn mới nhất */}
        {/* do nghiệp vụ nên đặt lên đầu */}
        <div ref={messageEndRef}></div>

        
        {/* infiniteScroll: còn tin nhắn để load ko */}
        {/* next hàm để ng dùng load thêm tin khi scroll lên */}
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          scrollableTarget={"scrollableDiv"}
          loader={<p>Đang tải...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible"
          }}
        >
          {reversedMessages.map((message, index) => (
            <MessageItem
                key={message._id ?? index}
                message={message}
                index={index}
                messages={reversedMessages}
                selectedConvo={selectedConvo}
                lastMessageStatus={lastMessageStatus}
            />

        ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default ChatWindowBody