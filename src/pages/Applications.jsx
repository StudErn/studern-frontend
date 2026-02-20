import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Briefcase, Calendar, MapPin, Search } from 'lucide-react'

const Applications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [jobDetailsMap, setJobDetailsMap] = useState({})

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`/applications`)
            const apps = response.data.data?.applications || []
            setApplications(apps)
            // Fetch hiring details for these applications to show description
            const hiringIds = Array.from(new Set(apps.map(a => a.hiring?.id).filter(Boolean)))
            if (hiringIds.length > 0) {
                const promises = hiringIds.map(id => axios.get(`/hirings/${id}`).catch(() => null))
                const results = await Promise.all(promises)
                const map = {}
                results.forEach((res, idx) => {
                    const id = hiringIds[idx]
                    if (res && res.data) {
                        map[id] = res.data.data || res.data
                    }
                })
                setJobDetailsMap(map)
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusStyle = (status) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            accepted: 'bg-green-50 text-green-700 border-green-200',
            rejected: 'bg-red-50 text-red-700 border-red-200',
            interview: 'bg-purple-50 text-purple-700 border-purple-200',
            offer: 'bg-blue-50 text-blue-700 border-blue-200'
        }
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
    }

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true
        return app.status === filter
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A3C40]">My Applications</h1>
                    <p className="text-gray-500 mt-1">Track and manage your job applications</p>
                </div>
                
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                    {['all', 'pending', 'interview', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                filter === status 
                                    ? 'bg-[#1A3C40] text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">Start your career journey by finding the perfect job</p>
                    <a href="/find-jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B8D4] text-white rounded-lg font-semibold hover:opacity-90 transition">
                        <Search className="w-5 h-5" />
                        Find Jobs
                    </a>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredApplications.map((application) => (
                        <div key={application.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    {application.company?.logo ? (
                                        <img 
                                            src={application.company.logo} 
                                            alt={application.company.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {application.hiring?.job_title || 'Unknown Position'}
                                        </h3>
                                        <p className="font-medium text-gray-700 mb-2">
                                            {application.company?.name || 'Unknown Company'}
                                        </p>
                                        {jobDetailsMap[application.hiring?.id]?.description && (
                                            <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                                                {jobDetailsMap[application.hiring?.id].description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {application.hiring?.hiring_type || 'Full-time'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {application.hiring?.work_from || 'On-site'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Applied: {new Date(application.applied_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusStyle(application.status)} capitalize`}>
                                        {application.status}
                                    </span>
                                    <Link to={`/dashboard/applications/${application.id}`} className="text-[#00B8D4] font-medium text-sm hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Applications
