import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useCompany } from '../../contexts/CompanyContext'
import { useToast } from '../../contexts/ToastContext'
import { Briefcase, Plus, Search, Filter, Eye, Edit, Trash2, MapPin, Clock } from 'lucide-react'
import axios from 'axios'

const JobsManagementPage = () => {
    const { selectedCompany, hasPrivilege } = useCompany()
    const { selectedCompany: contextCompany } = useOutletContext()
    const navigate = useNavigate()
    const toast = useToast()
    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const company = selectedCompany || contextCompany

    const canViewJobs = hasPrivilege('can_view_jobs')
    const canPostJobs = hasPrivilege('can_post_jobs')
    const canManageJobs = hasPrivilege('can_manage_jobs')

    useEffect(() => {
        if (company && canViewJobs) {
            fetchJobs()
        }
    }, [company, canViewJobs])

    useEffect(() => {
        filterJobs()
    }, [searchQuery, filterStatus, jobs])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE}/companies/${company.id}/hiring`)
            setJobs(response.data.data || [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
            toast.error('Failed to load jobs')
        } finally {
            setLoading(false)
        }
    }

    const filterJobs = () => {
        let filtered = jobs

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Filter by status
        if (filterStatus !== 'all') {
            if (filterStatus === 'active') {
                filtered = filtered.filter(job => job.is_active)
            } else if (filterStatus === 'inactive') {
                filtered = filtered.filter(job => !job.is_active)
            }
        }

        setFilteredJobs(filtered)
    }

    const handleDeleteJob = async (jobId) => {
        if (!canManageJobs) {
            toast.error('You do not have permission to delete jobs')
            return
        }

        if (!window.confirm('Are you sure you want to delete this job posting?')) {
            return
        }

        try {
            await axios.delete(`${API_BASE}/companies/${company.id}/hiring/${jobId}`)
            toast.success('Job deleted successfully')
            fetchJobs()
        } catch (error) {
            console.error('Error deleting job:', error)
            toast.error('Failed to delete job')
        }
    }

    if (!canViewJobs) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to view jobs for this company.</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
                    <p className="text-gray-600 mt-1">Manage your company's hiring opportunities</p>
                </div>
                {canPostJobs && (
                    <button
                        onClick={() => navigate(`/dashboard/jobs/create`)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} />
                        <span>Post New Job</span>
                    </button>
                )}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent outline-none"
                        >
                            <option value="all">All Jobs</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{job.job_title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            job.is_active 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {job.hiring_type}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Briefcase size={16} />
                                            <span>{job.employment_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{job.work_from}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={20} className="text-gray-600" />
                                    </button>
                                    {canManageJobs && (
                                        <>
                                            <button
                                                onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={20} className="text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} className="text-red-600" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filters' 
                                : 'Start by creating your first job posting'}
                        </p>
                        {canPostJobs && !searchQuery && filterStatus === 'all' && (
                            <button
                                onClick={() => navigate(`/dashboard/jobs/create`)}
                                className="px-6 py-3 bg-[#00B8D4] hover:bg-[#00a5bb] text-white rounded-lg font-medium transition-colors"
                            >
                                Post Your First Job
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobsManagementPage
