import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import studernLogo from '../assets/StudErn Logo.png'

const DashboardHeader = ({ 
    user, // Changed to receive user from props/parent or keep useAuth
    view,
    companies = [],
    selectedCompany,
    onViewChange,
    onCompanyChange,
    onMenuClick
}) => {
    const { logout } = useAuth() // keep useAuth for logout but prefer props for user if passed
    // If user is passed as prop, use it, else fallback (though parent passes it)
    
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        setIsProfileOpen(false)
    }

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo / Mobile menu toggle */}
                    <div className="flex items-center gap-2">
                        <button className="lg:hidden mr-2 p-2" onClick={() => onMenuClick && onMenuClick()}>
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                            <img src={studernLogo} alt="StudErn Logo" className="h-8 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search jobs, companies..."
                                className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* View Switcher - Only visible if user has companies */}
                    {companies && companies.length > 0 && (
                        <div className="hidden md:flex items-center gap-3 mr-4">
                            <select
                                value={view}
                                onChange={(e) => onViewChange(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                            >
                                <option value="applicant">Applicant View</option>
                                <option value="recruiter">Company View</option>
                            </select>

                            {view === 'recruiter' && (
                                <select
                                    value={selectedCompany?.id || ''}
                                    onChange={(e) => onCompanyChange(e.target.value)}
                                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                                >
                                    <option value="" disabled>Select Company</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-[#00B8D4] to-[#1A3C40] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user?.firstname?.charAt(0)}{user?.lastname?.charAt(0)}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-800">{user?.firstname} {user?.lastname}</p>
                                    <p className="text-xs text-gray-500">{user?.contact}</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{user?.firstname} {user?.lastname}</p>
                                            <p className="text-xs text-gray-500">{user?.contact}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link>
                                        <hr className="my-2 border-gray-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm w-full"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader
