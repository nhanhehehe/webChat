import { Badge } from "../ui/badge"

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
    return (
        // pulse-ring: animation lan nhẹ ra ngoài (trong index)
        <div className="pulse-ring absolute z-20 -top-1 -right-1">
            <Badge className="size-5 flex justify-center items-center p-0 text-xs bg-gradient-chat border border-background">
                {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
        </div>
    )
}

export default UnreadCountBadge