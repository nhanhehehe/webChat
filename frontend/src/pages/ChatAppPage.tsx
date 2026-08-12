import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { useAuthStore } from "@/stores/useAuthStore"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";


const ChatAppPage = () => {
  const user = useAuthStore(s => s.user); 
  const {teshMe} = useAuthStore();
  const handleTest = async () => {
    await teshMe();
  }

  return (
    <SidebarProvider>
      <AppSidebar/>

      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout/>
      </div>
    </SidebarProvider>
  )
}

export default ChatAppPage
