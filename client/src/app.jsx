
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
export const serverUrl = "http://localhost:8000"

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser(dispatch)
  }, [dispatch])
  const { userData } = useSelector(state => state.user);
  console.log('userData', userData)
  return (
    <div>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Navigate to ='/auth' replace/>} />
        <Route path="/auth" element={ userData ? <Navigate to ='/' replace/> : <Auth/>} />
        <Route path="/history" element={ userData ? <History/> : <Navigate to ='/' replace/>} />
        <Route path="/notes" element={ userData ? <Notes/> : <Navigate to ='/' replace/>} />
        <Route path="/pricing" element={ userData ? <Pricing/> : <Navigate to ='/' replace/>} />

      </Routes>

    </div>
  )
}
