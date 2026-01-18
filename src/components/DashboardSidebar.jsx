import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardSidebar = ({ selectedRole, onRoleChange, availableRoles }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()

    const applicantMenuItems = [
        { icon: '📊', label: 'Dashboard', path: '/' },
        { icon: '💼', label: 'Find Jobs', path: '/find-jobs' },
        { icon: '📝', label: 'My Applications', path: '/applications' },
        { icon: '⭐', label: 'Saved Jobs', path: '/saved-jobs' },
        { icon: '📅', label: 'Interviews', path: '/interviews' },
        { icon: '👤', label: 'Profile', path: '/profile' },
    ]

    const recruiterMenuItems = [
        { icon: '📊', label: 'Dashboard', path: '/' },
        { icon: '➕', label: 'Post Job', path: '/post-job' },
        { icon: '💼', label: 'My Jobs', path: '/my-jobs' },
        { icon: '👥', label: 'Applicants', path: '/applicants' },
        { icon: '📅', label: 'Interviews', path: '/interviews' },
        { icon: '🏢', label: 'Company', path: '/company' },
    ]

    const adminMenuItems = [
        { icon: '📊', label: 'Dashboard', path: '/' },
        { icon: '👥', label: 'Users', path: '/admin/users' },
        { icon: '🏢', label: 'Companies', path: '/admin/companies' },
        { icon: '💼', label: 'Jobs', path: '/admin/jobs' },
        { icon: '🔑', label: 'Privileges', path: '/admin/privileges' },
        { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
    ]

    const getMenuItems = () => {
        switch (selectedRole) {
            case 'recruiter':
                return recruiterMenuItems
            case 'admin':
                return adminMenuItems
            default:
                return applicantMenuItems
        }
    }

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

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Role Selector */}
                    {availableRoles.length > 1 && (
                        <div className="p-4 border-b border-gray-100">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                                View as
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => {
                                    onRoleChange(e)
                                    setIsSidebarOpen(false)
                                }}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none cursor-pointer"
                            >
                                {availableRoles.includes('applicant') && <option value="applicant">Applicant</option>}
                                {availableRoles.includes('recruiter') && <option value="recruiter">Recruiter</option>}
                                {availableRoles.includes('admin') && <option value="admin">Admin</option>}
                            </select>
                        </div>
                    )}

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-1">
                            {getMenuItems().map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            location.pathname === item.path
                                                ? 'bg-[#00B8D4] bg-opacity-10 text-[#00B8D4] font-semibold'
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
