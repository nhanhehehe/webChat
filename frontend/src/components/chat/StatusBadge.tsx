import { cn } from "@/lib/utils"


const StatusBadge = ({status}: {status: "online" | "offline"}) => {
  return (
    // border-card để màu viền khớp màu nền của card
    <div className={cn("absolute -bottom-0.5 -right-0.5 size-4 border-2 rounded-full border-card",
            status === "online" && "status-online",
            status === "offline" && "status-offline"
        )}
    >

    </div>
  )
}

export default StatusBadge