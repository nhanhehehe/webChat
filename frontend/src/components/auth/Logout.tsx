
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const Logout = () => {
    const {logOut} = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Button onClick={handleLogout}>
        Log out
    </Button>
  )
}

export default Logout