import {BrowserRouter, Route, Routes} from "react-router"
import SigninPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import ChatAppPage from "./pages/ChatAppPage"
import {Toaster} from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {

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
