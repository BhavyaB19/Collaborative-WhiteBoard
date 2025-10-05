import React from 'react'
import { Navigate } from 'react-router-dom'

const Hero = () => {

    const takeToLogin = () => {
        window.location.href = '/login';
    }

  return (
    <div>
        {/* Header */}
        <div className='flex justify-between items-center py-3 px-5 bg-black md:h-22 h-12 position-sticky'>
            <h1 className='text-4xl text-white '>Whiteboard</h1>
            <div className='flex gap-10'>
                <p className='text-white hover:text-indigo-500'>About</p>
                <p className='text-white hover:text-indigo-500'>Pricing</p>
                <p className='text-white hover:text-indigo-500'>Solutions</p>
            </div>
            <div className='flex gap-7'>
                <button className='bg-black border-1 border-white text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all duration-300 ' onClick={takeToLogin}>
                    Login
                </button>
                <button className='bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200' onClick={takeToLogin}>
                    Get Started
                </button>
            </div>
        </div>
        {/* Main Section */}
        <div className='min-h-screen bg-[url(bg2.png)] bg-center bg-cover bg-no-repeat '>
            <div className='flex flex-col items-center justify-center h-screen gap-6'>
                <p className='text-7xl text-white'>
                    Turning thoughts
                </p>
                <p className='text-7xl text-white'>
                    into shared visions...
                </p>
                <button className='text-xl text-black h-15 py-2 px-4 rounded-sm bg-white mt-4 hover:bg-gray-300 transition-all duration-300 '  onClick={takeToLogin}>
                    Get Started
                </button>
            </div>
        </div>
    </div>
  )
}

export default Hero