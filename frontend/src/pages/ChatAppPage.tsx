import SignOut from "@/components/auth/SignOut"
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore"


const ChatAppPage = () => {
  const user = useAuthStore(s => s.user); 
  const {teshMe} = useAuthStore();
  const handleTest = async () => {
    await teshMe();
  }

  return (
    <div>
      {user?.username}
      <SignOut/>
      <Button onClick={handleTest}>
        test
      </Button>
    </div>
  )
}

export default ChatAppPage
