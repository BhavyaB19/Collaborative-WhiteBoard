import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Hero from './pages/Hero'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import Aisehi from './pages/Aisehi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black/50 to-gray-800">
      <ToastContainer/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Hero />} />
        <Route path='/canvas' element={<Board/>}/>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        
        <Route path='/aisehi' element={<Aisehi/>}/>
      </Routes>
      
    </div>
    
    
  )
}

export default App