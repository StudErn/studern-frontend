import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useView } from '../contexts/ViewContext'

const DashboardSidebar = () => {
    const { selectedView, changeView, sidebarOpen, setSidebarOpen, toggleSidebar } = useView()
    const location = useLocation()
    const { privileges } = useAuth()
    

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
                    { icon: '📊', label: 'Dashboard', path: '/control-panel' },
                    { icon: '⚙️', label: 'Website Settings', path: '/control-panel/settings' },
                    { icon: '👥', label: 'User Management', path: '/control-panel/users' },
                    { icon: '🏢', label: 'Company Management', path: '/control-panel/companies' },
                    { icon: '📋', label: 'Hiring Management', path: '/control-panel/hiring' },
                    { icon: '📊', label: 'System Logs', path: '/admin/logs' },
                    { icon: '👤', label: 'Profile', path: '/profile' },
                ]
            default: // applicant
                return [
                    { icon: '📊', label: 'Dashboard', path: '/' },
                    { icon: '💼', label: 'Find Jobs', path: '/dashboard/find-jobs' },
                    { icon: '📝', label: 'My Applications', path: '/dashboard/applications' },
                    { icon: '⭐', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
                    { icon: '📅', label: 'Interviews', path: '/dashboard/interviews' },
                    { icon: '👤', label: 'Profile', path: '/dashboard/profile' },
                ]
        }
    }

    const menuItems = getMenuItems()

    return (
        <>
            {/* Mobile sidebar toggle moved to header for authenticated users */}

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
                                        onClick={() => setSidebarOpen(false)}
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
