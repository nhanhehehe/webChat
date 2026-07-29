
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const SignOut = () => {
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
    <Button onClick={handleSignout}>
        Log out
    </Button>
  )
}

export default SignOut