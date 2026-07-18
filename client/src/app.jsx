
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
export const serverUrl = "https://aiexamnotesserver-gnvx.onrender.com"

export function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser(dispatch).finally(() => setAuthChecked(true))
  }, [dispatch])
  const { userData } = useSelector(state => state.user);

  if (!authChecked) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Navigate to ='/auth' replace/>} />
        <Route path="/auth" element={ userData ? <Navigate to ='/' replace/> : <Auth/>} />
        <Route path="/history" element={ userData ? <History/> : <Navigate to ='/' replace/>} />
        <Route path="/notes" element={ userData ? <Notes/> : <Navigate to ='/' replace/>} />
        <Route path="/pricing" element={ userData ? <Pricing/> : <Navigate to ='/' replace/>} />
        <Route path="/payment-success" element={<PaymentSuccess/>} />
        <Route path="/payment-failed" element={<PaymentFailed/>} />

      </Routes>

    </div>
  )
}
