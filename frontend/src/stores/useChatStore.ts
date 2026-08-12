import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();

          set({ convoLoading: false, conversations: conversations });
        } catch (error) {
          console.error("lỗi xảy ra khi fetch conversations", error);
          set({ convoLoading: false });
        }
      },
      // hàm được chạy khi conversation active là true -> user click vào conversation -> group... Card
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          // đổi tên messages và cursor từ response để k trùng với data ở trước (messags, nextCursor)
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );

          // tách ra tin nhắn từ user và người khác (isOnw true nếu là tin nhắn của user)
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          //
          set((state) => {
            // lấy record tin nhắn hiện có
            const pre = state.messages[convoId]?.items ?? [];
            // nối tin nhắn vừa fetch được vào trong tin nhắn có sẵn trong một mảng
            const merged =
              pre.length > 0 ? [...processed, ...pre] : [...processed];

            return {
              messages: {
                ...state.messages,
                // Computed Property Name
                [convoId]: {
                  items: merged,
                  // !! đổi string sang boolean
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("lỗi khi fetch messages", error);
        } finally {
          set({ messageLoading: false });
        }
      },

      sendDirectMessage: async (recipientId, content, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined,
          );

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("lỗi xảy ra khi send direct message", error);
        }
      },

      sendGroupMessage: async (conversationId, content, imgUrl) => {
        try {
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra gửi group message", error);
        }
      },
      // thêm tin nhắn mới vào store từ socket
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          // prevItems là những tin nhắn khi mở conversation (khi mở conversation thì mới fetch api; nên ); vì vậy khi gửi một socket tin nhắn mới mà user chưa mở conversation, trong khi conversation đó user được gửi tin nhắn thì nếu cập nhật vào có thể khiến trong store (ui frontend) chỉ có đúng mỗi tin nhắn từ socket; khi user mở conversation -> fetch tin nhắn -> cập nhật tin nhắn mới -> thứ tự sắp xếp tin nhắn socket mới và tin nhắn cũ bị lệch
          if (prevItems.length === 0) {
            // fetch messages về store để khi cập nhật tin nhắn socket, tin nhắn cũ chắc chắn sẽ nằm trước tin nhắn socket
            await fetchMessages(message.conversationId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((c) => c._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("lỗi xảy ra khi add message", error);
        }
      },

      // cập nhật thông tin của conversation
      updateConversation: (conversation) => {
        set((state) => {
          return {
            conversations: state.conversations.map((c) =>
              c._id === conversation._id ? { ...c, ...conversation } : c,
            ),
          };
        });
      },

      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );

          if (!convo) {
            return;
          }

          if (convo.unreadCounts?.[user._id] ?? 0 === 0) {
            return;
          }

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.error("lỗi xảy ra khi mark as seen",error);
        }
      },
    }),

    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
