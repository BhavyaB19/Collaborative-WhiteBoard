import React, { useState } from 'react'

const Hero = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const takeToLogin = () => {
        window.location.href = '/login';
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Whiteboard
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#about" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                            About
                        </a>
                        <a href="#pricing" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                            Pricing
                        </a>
                        <a href="#solutions" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                            Solutions
                        </a>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button 
                            onClick={takeToLogin}
                            className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                        >
                            Login
                        </button>
                        <button 
                            onClick={takeToLogin}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md rounded-lg mt-2">
                            <a href="#about" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200">
                                About
                            </a>
                            <a href="#pricing" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200">
                                Pricing
                            </a>
                            <a href="#solutions" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200">
                                Solutions
                            </a>
                            <div className="pt-4 space-y-2">
                                <button 
                                    onClick={takeToLogin}
                                    className="block w-full text-left px-3 py-2 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors duration-200"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>

        {/* Main Hero Section */}
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-[url('bg2.png')] bg-center bg-cover bg-no-repeat"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/60"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="space-y-6 sm:space-y-8">
                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Turning thoughts
                            </span>
                            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                into shared visions...
                            </span>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        Collaborate in real-time with our intuitive whiteboard platform. 
                        Bring your ideas to life with powerful drawing tools and seamless sharing.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8">
                        <button 
                            onClick={takeToLogin}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>  
                </div>
            </div>
        </main>
    </div>
  )
}

export default Hero