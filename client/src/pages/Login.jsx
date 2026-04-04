import axios from 'axios';
import React, { useContext, useState } from 'react';
import {toast} from 'react-toastify';
import { UserContext } from '../context/UserContext.jsx';
import {useLocation, useNavigate} from 'react-router-dom'
import axiosInstance from '../utils/helper.js';

const Login = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const {backendUrl, userData, setUserData, getUserData, setToken} = useContext(UserContext)
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true;
      const {name, email, password} = formData;
      if (!isLogin) {
        const {data} = await axiosInstance.post('/api/users/signup', {name, email, password})
        if (data?.success) {
          setIsLogin(true)
          
          toast.success("Account created successfully")
          
        } else{
          toast.error(data?.message)
        } 
      } else {
        const {data} = await axiosInstance.post('/api/users/login', {email, password})
        if (data?.success) {
          setIsLogin(true)
          localStorage.setItem('token', data.token)
          await getUserData()
          toast.success(data?.message)
          const from = location.state?.from
          if (from) navigate(from)
          else navigate('/dashboard')
        } else {
          toast.error(data?.message)
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message
      toast.error(errorMessage);
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative" style={{ backgroundColor: '#0f0f17' }}>
      {/* Dot grid background matching landing page */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
              <circle cx="11" cy="11" r="2"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Whiteboard</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-8 sm:p-10" style={{ backgroundColor: '#16161f' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-white/40">
              {isLogin ? 'Sign in to continue to your boards' : 'Get started with your free account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition-all duration-200"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition-all duration-200"
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30" />
                  <span className="text-sm text-white/40">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-blue-400 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#16161f]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/30 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors focus:outline-none"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Login;
