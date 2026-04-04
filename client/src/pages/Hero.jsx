import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const takeToLogin = () => {
        navigate('/login');
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                                <path d="M2 2l7.586 7.586"/>
                                <circle cx="11" cy="11" r="2"/>
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Whiteboard
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium">
                            Features
                        </a>
                        <a href="#about" className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium">
                            About
                        </a>
                        <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium">
                            Pricing
                        </a>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button 
                            onClick={takeToLogin}
                            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium"
                        >
                            Log in
                        </button>
                        <button 
                            onClick={takeToLogin}
                            className="px-5 py-2.5 bg-white text-[#0a0a0f] text-sm rounded-lg hover:bg-white/90 transition-all duration-200 font-semibold"
                        >
                            Get Started — Free
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white/70 hover:text-white focus:outline-none transition-colors duration-200"
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
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#12121a] rounded-lg mt-2 border border-white/5">
                            <a href="#features" className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200">
                                Features
                            </a>
                            <a href="#about" className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200">
                                About
                            </a>
                            <a href="#pricing" className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200">
                                Pricing
                            </a>
                            <div className="pt-3 border-t border-white/5 space-y-2">
                                <button 
                                    onClick={takeToLogin}
                                    className="block w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
                                >
                                    Log in
                                </button>
                                <button 
                                    onClick={takeToLogin}
                                    className="block w-full text-left px-3 py-2.5 bg-white text-[#0a0a0f] text-sm rounded-lg font-semibold"
                                >
                                    Get Started — Free
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>

        {/* Main Hero Section */}
        <main className="relative overflow-hidden">
            {/* Dot grid background */}
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            {/* Subtle glow accents */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]"></div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 lg:pt-40 pb-20">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Real-time collaborative whiteboard
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        <span className="text-white">Think together.</span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                            Build together.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
                        A collaborative whiteboard for teams who think visually. Sketch ideas, 
                        diagram flows, and brainstorm in real-time — no friction, no limits.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                        <button 
                            onClick={takeToLogin}
                            className="group px-8 py-3.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30"
                        >
                            Start Drawing — It's Free
                        </button>
                        <button 
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-3.5 text-white/60 text-sm font-medium rounded-xl border border-white/10 hover:border-white/20 hover:text-white/80 transition-all duration-200"
                        >
                            See how it works
                        </button>
                    </div>
                </div>

                {/* Canvas Preview */}
                <div className="mt-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none"></div>
                    <div className="rounded-2xl border border-white/10 bg-[#12121a] p-1 shadow-2xl shadow-black/50">
                        <div className="rounded-xl bg-[#1a1a24] overflow-hidden">
                            {/* Mock toolbar */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                                    <div className="w-3 h-3 rounded-full bg-white/10"></div>
                                </div>
                                <div className="flex gap-3 ml-6">
                                    {['Pen', 'Line', 'Shape', 'Eraser'].map((t) => (
                                        <div key={t} className="px-3 py-1 rounded-md text-xs text-white/30 bg-white/5">{t}</div>
                                    ))}
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="flex -space-x-1.5">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/60 border-2 border-[#1a1a24]"></div>
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/60 border-2 border-[#1a1a24]"></div>
                                        <div className="w-6 h-6 rounded-full bg-orange-500/60 border-2 border-[#1a1a24]"></div>
                                    </div>
                                    <span className="text-xs text-white/30 ml-1">3 online</span>
                                </div>
                            </div>
                            {/* Mock canvas area */}
                            <div className="h-64 sm:h-80 relative" style={{
                                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }}>
                                {/* Decorative sketch lines */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Freehand sketch line */}
                                    <path d="M100 180 C150 120, 200 100, 280 130 C360 160, 320 220, 380 200" 
                                          stroke="rgba(96,165,250,0.3)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                                    {/* Rectangle */}
                                    <rect x="420" y="80" width="160" height="100" rx="4" 
                                          stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
                                    {/* Circle */}
                                    <circle cx="250" cy="230" r="40" 
                                            stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" fill="none"/>
                                    {/* Arrow line */}
                                    <path d="M330 240 L420 160" 
                                          stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round"/>
                                    {/* Text placeholder blocks */}
                                    <rect x="440" y="100" width="80" height="6" rx="3" fill="rgba(255,255,255,0.06)"/>
                                    <rect x="440" y="115" width="120" height="6" rx="3" fill="rgba(255,255,255,0.04)"/>
                                    <rect x="440" y="130" width="60" height="6" rx="3" fill="rgba(255,255,255,0.03)"/>
                                    {/* Another freehand curve */}
                                    <path d="M600 60 C620 120, 680 150, 720 100 C760 50, 750 200, 700 250" 
                                          stroke="rgba(96,165,250,0.15)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                                </svg>
                                {/* Cursor indicators */}
                                <div className="absolute top-[35%] left-[30%] flex items-start gap-1">
                                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                                        <path d="M0.5 0.5L11 8L5.5 8.5L3 15L0.5 0.5Z" fill="#3b82f6" stroke="#3b82f6" strokeWidth="0.5"/>
                                    </svg>
                                    <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium">Alex</span>
                                </div>
                                <div className="absolute top-[55%] left-[60%] flex items-start gap-1">
                                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                                        <path d="M0.5 0.5L11 8L5.5 8.5L3 15L0.5 0.5Z" fill="#10b981" stroke="#10b981" strokeWidth="0.5"/>
                                    </svg>
                                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-medium">Sam</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Everything you need to collaborate visually
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Simple, powerful tools designed for teams that think on whiteboards.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="group p-6 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Real-time Collaboration</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Draw together with your team in real-time. See live cursors, instant updates, and active presence indicators.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-6 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                                <path d="M2 2l7.586 7.586"/>
                                <circle cx="11" cy="11" r="2"/>
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Versatile Drawing Tools</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Pen, shapes, lines, and eraser — all the brushes you need to express ideas quickly and clearly.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-6 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors duration-300">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Instant Sharing</h3>
                        <p className="text-sm text-white/40 leading-relaxed">
                            Share your board with a single link. Invite teammates instantly — no sign-up friction for collaborators.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                            </svg>
                        </div>
                        <span className="text-sm text-white/30">Whiteboard</span>
                    </div>
                    <p className="text-xs text-white/20">© 2026 Whiteboard. Built for visual thinkers.</p>
                </div>
            </footer>
        </main>
    </div>
  )
}

export default Hero