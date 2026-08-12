import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore';
import type { Conversation } from '@/types/chat';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ImagePlus, Send } from 'lucide-react';
import { Input } from '../ui/input';
import EmojiPickerUi from './EmojiPicker';
import { toast } from 'sonner';

const MessageInput = ({selectedConvo}: {selectedConvo: Conversation}) => {
  const {user} = useAuthStore();
  const [value, setValue] = useState("");
  const {sendDirectMessage, sendGroupMessage} = useChatStore()

  const sendMessage = async () => {
    if (!value.trim()) {
      return;
    }
    // để lưu giá trị value này và reset value; vì nếu reset value tại finally -> phải đợi chạy await send message -> value vẫn còn tồn tại, button k bị disabled, có thể gửi thêm tin nhắn
    const currValue = value;
    setValue("");

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((c) => (c._id !== user?._id))[0];
        await sendDirectMessage(otherUser._id, currValue);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue);
      }
    } catch (error) {
      toast.error("lỗi xảy ra khi gửi tin nhắn. Hãy thử lại!");
      console.error(error);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
    
  }
  
  return (
    <div className='flex items-center gap-2 p-3 min-h-[56px] bg-background'>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 transition-smooth"
      >
        <ImagePlus className='size-4'/>
      </Button>

      <div className='flex-1 relative'>
        
        <Input
          value={value}
          onChange={(e) => (setValue(e.target.value))}
          placeholder="Soạn tin nhắn..."
          onKeyDown={handleKeyPress}
          // resize-none để ô input không bị thay đổi khi kích thước của nội dung input
          className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
        ></Input>

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <EmojiPickerUi onChange={(emoji: string) => (setValue(`${value}${emoji}`))}/>
        </div>

      </div>

      <Button
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
        onClick={sendMessage}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  )
}

export default MessageInput