import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import studernLogo from '../assets/StudErn Logo.png'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center cursor-pointer no-underline transition-opacity hover:opacity-90">
                    <img src={studernLogo} alt="StudErn Logo" className="h-10 w-auto object-contain" />
                </Link>

                {/* Desktop Menu - Centered Links */}
                <div className="hidden lg:flex items-center gap-6 font-medium text-gray-600 text-sm">
                    <Link to="/find-jobs" className="hover:text-[#00B8D4] transition-colors relative group">
                        Find Jobs
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00B8D4] group-hover:w-full transition-all"></span>
                    </Link>
                    <Link to="/internships" className="hover:text-[#00B8D4] transition-colors relative group">
                        Internships
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00B8D4] group-hover:w-full transition-all"></span>
                    </Link>
                    <Link to="/courses" className="hover:text-[#00B8D4] transition-colors relative group">
                        E-Learning
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00B8D4] group-hover:w-full transition-all"></span>
                    </Link>
                    <Link to="/job-fair" className="hover:text-[#00B8D4] transition-colors relative group">
                        Job Fair
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00B8D4] group-hover:w-full transition-all"></span>
                    </Link>
                </div>

                {/* Right Side Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#00B8D4] to-[#1A3C40] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.firstname}</span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm" onClick={() => setIsProfileOpen(false)}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Settings
                                            </Link>
                                            <hr className="my-2" />
                                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm w-full">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="px-5 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#00B8D4] to-[#1A3C40] text-white hover:shadow-lg hover:scale-105 transition-all">
                                Join Now
                            </Link>
                            <Link to="/login" className="px-5 py-2 rounded-lg font-semibold text-sm border-2 border-[#1A3C40] text-[#1A3C40] hover:bg-[#1A3C40] hover:text-white transition-all">
                                Login
                            </Link>
                        </>
                    )}
                    <Link to="/post-job" className="ml-2 px-5 py-2 rounded-lg font-semibold text-sm bg-[#FFD700] text-[#1A3C40] hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Post Job
                    </Link>
                </div>

                {/* Hamburger Menu Toggle (Mobile) */}
                <button className="flex flex-col gap-1.5 cursor-pointer lg:hidden z-50 p-2" onClick={toggleMenu}>
                    <span className={`w-6 h-0.5 bg-[#1A3C40] rounded-sm transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-[#1A3C40] rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-[#1A3C40] rounded-sm transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
                    <ul className="flex flex-col items-center gap-6 font-semibold text-lg text-gray-800">
                        <li><Link to="/find-jobs" onClick={() => setIsMenuOpen(false)} className="hover:text-[#00B8D4]">Find Jobs</Link></li>
                        <li><Link to="/internships" onClick={() => setIsMenuOpen(false)} className="hover:text-[#00B8D4]">Internships</Link></li>
                        <li><Link to="/courses" onClick={() => setIsMenuOpen(false)} className="hover:text-[#00B8D4]">E-Learning</Link></li>
                        <li><Link to="/job-fair" onClick={() => setIsMenuOpen(false)} className="hover:text-[#00B8D4]">Job Fair</Link></li>
                    </ul>
                    <div className="flex flex-col gap-4 w-64">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#00B8D4] to-[#1A3C40] rounded-full flex items-center justify-center text-white font-bold">
                                        {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{user?.firstname}</p>
                                        <p className="text-xs text-gray-500">{user?.contact}</p>
                                    </div>
                                </div>
                                <Link to="/profile" className="w-full py-3 rounded-lg font-semibold text-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                <button onClick={handleLogout} className="w-full py-3 rounded-lg font-semibold text-center bg-red-500 text-white hover:bg-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="w-full py-3 rounded-lg font-semibold text-center bg-gradient-to-r from-[#00B8D4] to-[#1A3C40] text-white" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                                <Link to="/login" className="w-full py-3 rounded-lg font-semibold text-center border-2 border-[#1A3C40] text-[#1A3C40]" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            </>
                        )}
                        <Link to="/post-job" className="w-full py-3 rounded-lg font-semibold text-center bg-[#FFD700] text-[#1A3C40]" onClick={() => setIsMenuOpen(false)}>Post Job</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
