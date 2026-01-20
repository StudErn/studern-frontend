import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useView } from '../contexts/ViewContext'

const DashboardSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()
    const { privileges } = useAuth()
    const { selectedView, changeView } = useView()

    const getMenuItems = () => {
        switch (selectedView) {
            case 'recruiter':
                return [
                    { icon: '📊', label: 'Dashboard', path: '/' },
                    { icon: '💼', label: 'Company Jobs', path: '/dashboard/jobs' },
                    { icon: '➕', label: 'Post Job', path: '/dashboard/jobs/create' },
                    { icon: '👥', label: 'Team Members', path: '/dashboard/members' },
                    { icon: '👤', label: 'Profile', path: '/profile' },
                ]
            case 'system_panel':
                return [
                    { icon: '📊', label: 'Dashboard', path: '/' },
                    { icon: '⚙️', label: 'Website Settings', path: '/system-settings' },
                    { icon: '👥', label: 'User Management', path: '/admin/users' },
                    { icon: '🏢', label: 'Company Management', path: '/admin/companies' },
                    { icon: '📋', label: 'Hiring Management', path: '/admin/hiring' },
                    { icon: '📊', label: 'System Logs', path: '/admin/logs' },
                    { icon: '👤', label: 'Profile', path: '/profile' },
                ]
            default: // applicant
                return [
                    { icon: '📊', label: 'Dashboard', path: '/' },
                    { icon: '💼', label: 'Find Jobs', path: '/find-jobs' },
                    { icon: '📝', label: 'My Applications', path: '/applications' },
                    { icon: '⭐', label: 'Saved Jobs', path: '/saved-jobs' },
                    { icon: '📅', label: 'Interviews', path: '/interviews' },
                    { icon: '👤', label: 'Profile', path: '/profile' },
                ]
        }
    }

    const menuItems = getMenuItems()

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#1A3C40] text-white p-4 rounded-full shadow-lg hover:bg-opacity-90"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* View Selector */}
                    {privileges.available_views.length > 1 && (
                        <div className="p-4 border-b border-gray-100">
                            <label className="block text-xs font-medium text-gray-500 mb-2">View As</label>
                            <select
                                value={selectedView}
                                onChange={(e) => changeView(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-[#00B8D4] bg-white"
                            >
                                {privileges.available_views.map((view) => (
                                    <option key={view} value={view}>
                                        {view === 'applicant' && 'Applicant'}
                                        {view === 'recruiter' && 'Recruiter'}
                                        {view === 'system_panel' && 'System Panel'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-1">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            location.pathname === item.path
                                                ? 'bg-[#00B8D4] bg-opacity-10 text-[#ffffff] font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default DashboardSidebar
