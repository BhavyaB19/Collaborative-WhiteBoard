import axios from 'axios';
import React, { useContext, useState } from 'react';
import {toast} from 'react-toastify';
import { UserContext } from '../context/UserContext.jsx';
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()
  const {backendUrl, userData, setUserData, getUserData} = useContext(UserContext)
  
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
        const {data} = await axios.post( backendUrl+ '/api/users/signup', {name, email, password})
        if (data?.success) {
          setIsLogin(true)
          await getUserData()
          toast.success("Account created successfully")
          setTimeout(() => navigate('/dashboard'), 2000)
        } else{
          toast.error(data?.message)
        } 
      } else {
        const {data} = await axios.post(backendUrl + '/api/users/login', {email, password})
        if (data?.success) {
          setIsLogin(true)
          await getUserData()
          toast.success(data?.message)
          navigate('/dashboard')
        } else {
          toast.error(data?.message)
        }
      }
    } catch (error) {
      toast.error(error.message);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-600 to-gray-800 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md relative overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300"
            />
          </div>

          {isLogin && (
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <span className="text-sm">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-900 via-gray-600 to-gray-800 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:from-gray-700 hover:to-gray-600 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-600 hover:text-indigo-500 font-semibold underline transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Divider */}
        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div> */}

        {/* Social Login */}
        {/* <div>
          <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
        </div> */}
        
      </div>
    </div>
    
  );
};

export default Login;
