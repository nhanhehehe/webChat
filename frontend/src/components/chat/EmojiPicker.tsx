import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { Button } from "../ui/button";
interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPickerUi = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer" 
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 hover:bg-primary/10 transition-smooth"
          />
        }>
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-tranparent border-none shadow-none drop-shadow-none mb-12"
      >
        <EmojiPicker 
            theme={isDark ? Theme.DARK : Theme.LIGHT}
            onEmojiClick={(emojiObject) => onChange(emojiObject.emoji)} 
            emojiStyle={EmojiStyle.APPLE}
        />
            
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerUi;