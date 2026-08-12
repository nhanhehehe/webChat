import { MoreHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatOnlineTime, cn } from "@/lib/utils" // các utils dùng để đổi Date sang như 1 minutes ago, ... (nhờ ai làm) | cn merge class lại với nhau 

interface ChatCardProps {
    convoId: string,
    name: string,
    timestamps?: Date,
    isActive: boolean,
    onSelect: (id: string) => void,
    unreadCount?: number,
    // avatar
    leftSection: React.ReactNode,
    // số lượng thành viên nếu group | tin nhắn nếu direct 
    subtitle: React.ReactNode,
}

const ChatCard = ({ convoId, name, timestamps, isActive, onSelect, unreadCount, leftSection, subtitle }: ChatCardProps) => {
    return (
        // glass define trong index.css de tao hieu ung trong suot
        <Card key={convoId} className={cn("border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30", 
            // chưa hiểu các cú pháp taiwind này lắm | from, to: chuyển từ màu tím phía dưới lên trên màu foreground
            isActive && "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground"
        )}
        // onSelect cập nhật convo nào active để lấy messages tương ứng
        onClick={() => onSelect(convoId)}
        >
            <div className="flex items-center gap-3">
                {/* avatar ; cố định relative để statusBadge absolute*/} 
                <div className="relative">{leftSection}</div>

                {/* nội dung bên phải: thời gian, tin nhắn, ... */}
                <div className="flex-1 min-w-0">
                    {/* nửa dòng trên: time và tên nhóm */}
                    <div className="flex items-center justify-between">
                        <h3 className={cn("text-sm font-semibold truncate", 
                            unreadCount && unreadCount > 0 && "text-foreground"
                        )}>
                            {name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                            {timestamps ? formatOnlineTime(timestamps) : ""}
                        </span>
                    </div>

                    {/* sl tv hoặc tin nhắn */}
                    <div className="flex items-center justify-between">
                        {/* trick: flex-1 min-w-0 các đoạn text dài trong item flex box kh vượt container */}
                        <div className="flex items-center gap-1 flex-1 min-w-0">{subtitle}</div>
                        {/* icon moreHoriontal */}
                        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth "/>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatCard