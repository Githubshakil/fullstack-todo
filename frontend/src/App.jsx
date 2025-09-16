import { BrowserRouter, Routes, Route } from "react-router-dom"
import Registration from "./pages/Registration"
import Login from "./pages/Login"
import VerifyEmail from "./pages/VerifyEmail"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"


const App = () => {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration/>} />
          <Route path="/login" element={<Login/>} />
          <Route path={`/verify/:token`} element={<VerifyEmail/>} />
          <Route path={`/reset/:token`} element={<ResetPassword/>} />
          <Route path={`/forgot-password`} element={<ForgotPassword/>} />

        </Routes>
      
      </BrowserRouter>
  )
}

export default App