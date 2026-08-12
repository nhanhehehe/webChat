import {BrowserRouter, Route, Routes} from "react-router"
import SigninPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import ChatAppPage from "./pages/ChatAppPage"
import {Toaster} from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { useThemeStore } from "./stores/useThemeStore"
import { useEffect } from "react"
import { useAuthStore } from "./stores/useAuthStore"
import { useSocketStore } from "./stores/useSocketStore"

function App() {
  const  {isDark, setTheme} = useThemeStore();
  const {accessToken} = useAuthStore();
  const {connectSocket, disconnectSocket} = useSocketStore();

  // mỗi khi reload, nhờ persist -> lấy từ zustand để cập nhật theme;
  useEffect(() => {
    setTheme(isDark);
  }, [isDark])

  // quan sát thay đổi của accessToken
  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken])

  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>

        {/* public route */}
        <Route path="/signin" element={<SigninPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>

        {/* protected route */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<ChatAppPage/>}/>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
    
  )
}

export default App
