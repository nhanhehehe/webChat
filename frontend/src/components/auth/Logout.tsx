
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
    const {signOut} = useAuthStore();
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Button onClick={handleSignout} variant={"completeGhost"}>
        {/* icon nút logout  */}
        <LogOut className="text-destructive" />
        Log out
    </Button>
  )
}

export default Logout