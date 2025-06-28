import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import EmailVerify from './EmailVerify'
import ResetPassword from './ResetPassword'
import OtpVerify from './OtpVerify'
import NewPassword from './NewPassword'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/emailverify' element={<EmailVerify />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/otpverify' element={<OtpVerify />} />
        <Route path='/newpassword' element={<NewPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
