import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useCompany } from '../contexts/CompanyContext'
import { 
    Briefcase, Users, FileText, TrendingUp, 
    Plus, Eye, Edit, Trash2, Building2, Settings 
} from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import axios from 'axios'

const CompanyDashboardPage = () => {
    const { selectedCompany, hasPrivilege } = useCompany()
    const { selectedCompany: contextCompany } = useOutletContext()
    const navigate = useNavigate()
    const toast = useToast()
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplicants: 0,
        scheduledInterviews: 0,
        companyMembers: 0
    })
    const [recentJobs, setRecentJobs] = useState([])
    const [loading, setLoading] = useState(true)

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const company = selectedCompany || contextCompany

    useEffect(() => {
        if (company) {
            fetchDashboardData()
        }
    }, [company])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            
            // Fetch company hiring details
            if (hasPrivilege('can_view_jobs')) {
                const hiringResponse = await axios.get(`${API_BASE}/companies/${company.id}/hiring`)
                const jobs = hiringResponse.data.data || []
                setRecentJobs(jobs.slice(0, 5))
                setStats(prev => ({ ...prev, activeJobs: jobs.filter(j => j.is_active).length }))
            }

            // Fetch company users if has permission
            if (hasPrivilege('can_view_users')) {
                const usersResponse = await axios.get(`${API_BASE}/companies/${company.id}/users`)
                const users = usersResponse.data.data || []
                setStats(prev => ({ ...prev, companyMembers: users.length }))
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const canPostJobs = hasPrivilege('can_post_jobs')
    const canManageJobs = hasPrivilege('can_manage_jobs')
    const canManageUsers = hasPrivilege('can_manage_users')
    const canManageCompany = hasPrivilege('can_manage_company')

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Company Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00B8D4] to-[#1A3C40] rounded-xl flex items-center justify-center">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{company?.company_name}</h1>
                            <p className="text-gray-600">{company?.company_type}</p>
                        </div>
                    </div>
                    {canManageCompany && (
                        <button
                            onClick={() => navigate(`/company/${company.id}/settings`)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <Settings size={18} />
                            <span>Company Settings</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="text-[#00B8D4]" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Applicants</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Interviews</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.scheduledInterviews}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <FileText className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Team Members</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.companyMembers}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {canPostJobs && (
                        <button
                            onClick={() => navigate(`/company/${company.id}/jobs/create`)}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#00B8D4] to-[#00a5bb] text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            <Plus size={20} />
                            <span className="font-medium">Post New Job</span>
                        </button>
                    )}
                    {canManageUsers && (
                        <button
                            onClick={() => navigate(`/company/${company.id}/users`)}
                            className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <Users size={20} />
                            <span className="font-medium">Manage Users</span>
                        </button>
                    )}
                    {hasPrivilege('can_view_reports') && (
                        <button
                            onClick={() => navigate(`/company/${company.id}/reports`)}
                            className="flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <TrendingUp size={20} />
                            <span className="font-medium">View Reports</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Recent Jobs */}
            {hasPrivilege('can_view_jobs') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                        {canManageJobs && (
                            <button
                                onClick={() => navigate(`/company/${company.id}/jobs`)}
                                className="text-[#00B8D4] hover:text-[#00a5bb] font-medium text-sm"
                            >
                                View All
                            </button>
                        )}
                    </div>

                    {recentJobs.length > 0 ? (
                        <div className="space-y-3">
                            {recentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                                        <p className="text-sm text-gray-600">{job.type} • {job.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            job.is_active 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        {canManageJobs && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/company/${company.id}/jobs/${job.id}`)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} className="text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/company/${company.id}/jobs/${job.id}/edit`)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} className="text-blue-600" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-600 mb-4">No job postings yet</p>
                            {canPostJobs && (
                                <button
                                    onClick={() => navigate(`/company/${company.id}/jobs/create`)}
                                    className="px-6 py-2.5 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg font-medium transition-colors"
                                >
                                    Create Your First Job
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* No Privileges Message */}
            {!hasPrivilege('can_view_jobs') && !canManageUsers && !canManageCompany && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Limited Access</h3>
                    <p className="text-yellow-800">
                        You have limited privileges in this company. Contact your company administrator to request additional permissions.
                    </p>
                </div>
            )}
        </div>
    )
}

export default CompanyDashboardPage
