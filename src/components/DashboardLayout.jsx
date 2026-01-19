import React, { useState, useEffect } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2, Plus, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import studernLogo from '../assets/StudErn Logo.png'
import axios from 'axios'

const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isCompanyOpen, setIsCompanyOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        fetchUserCompanies()
    }, [])

    const fetchUserCompanies = async () => {
        try {
            const response = await axios.get(`${API_BASE}/companies/my`)
            const companiesList = response.data.data || []
            setCompanies(companiesList)
            
            // Set first company as selected by default if available
            if (companiesList.length > 0) {
                setSelectedCompany(companiesList[0])
                localStorage.setItem('selectedCompany', JSON.stringify(companiesList[0]))
            }
        } catch (error) {
            console.error('Error fetching companies:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCompanyChange = (company) => {
        setSelectedCompany(company)
        localStorage.setItem('selectedCompany', JSON.stringify(company))
        setIsCompanyOpen(false)
        // Reload the page to refresh company-specific data
        window.location.reload()
    }

    const handleLogout = () => {
        logout()
        setIsProfileOpen(false)
        navigate('/login')
    }

    const handleCreateCompany = () => {
        navigate('/create-company')
        setIsCompanyOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <img src={studernLogo} alt="StudErn Logo" className="h-8 w-auto object-contain" />
                        </Link>

                        {/* Right Side - Company Selector & Profile */}
                        <div className="flex items-center gap-4">
                            {/* Company Selector */}
                            {!loading && companies.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                    >
                                        <Building2 size={18} className="text-[#00B8D4]" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {selectedCompany?.company_name || 'Select Company'}
                                        </span>
                                        <ChevronDown size={16} className="text-gray-500" />
                                    </button>

                                    {isCompanyOpen && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setIsCompanyOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Your Companies</p>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {companies.map((company) => (
                                                        <button
                                                            key={company.id}
                                                            onClick={() => handleCompanyChange(company)}
                                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                                                selectedCompany?.id === company.id ? 'bg-blue-50' : ''
                                                            }`}
                                                        >
                                                            <Building2 size={16} className={selectedCompany?.id === company.id ? 'text-[#00B8D4]' : 'text-gray-400'} />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900">{company.company_name}</p>
                                                                <p className="text-xs text-gray-500">{company.company_type}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="border-t border-gray-100 mt-2">
                                                    <button
                                                        onClick={handleCreateCompany}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-[#00B8D4]"
                                                    >
                                                        <Plus size={16} />
                                                        <span className="text-sm font-medium">Create New Company</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Create Company Button (if no companies) */}
                            {!loading && companies.length === 0 && (
                                <button
                                    onClick={() => navigate('/create-company')}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Plus size={18} />
                                    <span>Create Company</span>
                                </button>
                            )}

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#00B8D4] flex items-center justify-center text-white font-bold text-sm">
                                        {user?.firstname?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-medium text-gray-900">{user?.firstname} {user?.lastname}</p>
                                        <p className="text-xs text-gray-500">@{user?.username}</p>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsProfileOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <User size={16} />
                                                <span className="text-sm">Profile</span>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Settings size={16} />
                                                <span className="text-sm">Settings</span>
                                            </Link>
                                            <hr className="my-2 border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
                                            >
                                                <LogOut size={16} />
                                                <span className="text-sm">Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {selectedCompany ? (
                    <Outlet context={{ selectedCompany, companies }} />
                ) : companies.length === 0 && !loading ? (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Privilege Assigned</h2>
                            <p className="text-gray-600 mb-6">
                                You don't have access to any company yet. Please contact an admin or create your own company to get started.
                            </p>
                            <button
                                onClick={() => navigate('/create-company')}
                                className="px-6 py-3 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg font-medium transition-colors"
                            >
                                Create Your Company
                            </button>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading companies...</p>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <Building2 size={64} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Privilege Assigned</h2>
                            <p className="text-gray-600 mb-6">
                                You don't have access to any company yet. Please contact an admin or create your own company to get started.
                            </p>
                            <button
                                onClick={() => navigate('/create-company')}
                                className="px-6 py-3 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg font-medium transition-colors"
                            >
                                Create Your Company
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default DashboardLayout
