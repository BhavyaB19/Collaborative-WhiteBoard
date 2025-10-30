import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Hero from './pages/Hero'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import Aisehi from './pages/Aisehi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react'
import { UserContext } from './context/UserContext'
import InviteJoin from './pages/InviteJoin'

const App = () => {
  const {token} = useContext(UserContext)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black/50 to-gray-800">
      <ToastContainer/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Hero />} />
        <Route path='/board/:boardId' element={token ? <Board/> : <Navigate to="/login" />}/>
        <Route path='/dashboard' element={token ? <Dashboard/> : <Navigate to="/login" />}></Route>
        <Route path='/join/:inviteToken' element={<InviteJoin/>}/>

        <Route path='/aisehi' element={<Aisehi/>}/>
      </Routes>
      
    </div>
    
    
  )
}

export default App