import api from "@/lib/axios"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ConversationResponse, Message  } from "@/types/chat"

interface FetchMessageProps {
    messages: Message[];
    cursor?: string;
}

const pageLimit = 20;

export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const ressponse = await api.get("/conversations");
        return ressponse.data;
    },

    async fetchMessages(id: string, cursor?: string) : Promise<FetchMessageProps> {
        const response = await api.get(`/conversations/${id}/messages?limit=${pageLimit}&cursor=${cursor}`)
        
        return {messages: response.data.messages, cursor: response.data.nextCursor}

    },

    async sendDirectMessage(recipientId: string, content: string = "", imgUrl?: string, conversationId?: string,) {
        const response = await api.post("/messages/direct/", {recipientId, content, imgUrl, conversationId});
        return response.data.message;
    },

    async sendGroupMessage(conversationId: string, content: string = "", imgUrl?: string) {
        const response = await api.post("/messages/group/", {conversationId, content, imgUrl});
        return response.data.message;
    },

    async markAsSeen (conversationId: string) {
        const response = await api.patch(`/conversations/${conversationId}/seen`);
        return response.data;
    }

    
}