import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useView } from '../contexts/ViewContext'
import { useCompany } from '../contexts/CompanyContext'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Building2, Briefcase, Users, CheckCircle, XCircle, Clock, TrendingUp, Edit, Trash2, Calendar, Video } from 'lucide-react'
import { useHiring } from '../contexts/HiringContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const { selectedView } = useView()
    const location = useLocation()

    const renderDashboardContent = () => {
        // Force System Panel if routed via control-panel
        if (location.pathname.startsWith('/control-panel')) {
            return <SystemPanelDashboard />
        }

        switch (selectedView) {
            case 'recruiter':
                return <RecruiterDashboard />
            case 'system_panel':
                return <SystemPanelDashboard />
            default:
                return <ApplicantDashboard />
        }
    }

    return renderDashboardContent()
}

const ApplicantDashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        totalInterviews: 0,
        upcomingInterviews: 0,
        totalSavedJobs: 0,
        loading: true
    })
    const [recentApplications, setRecentApplications] = useState([])
    const [upcomingInterviewsList, setUpcomingInterviewsList] = useState([])

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        fetchApplicantStats()
    }, [])

    const fetchApplicantStats = async () => {
        try {
            setStats(prev => ({ ...prev, loading: true }))

            const [applicationsRes, interviewsRes, savedJobsRes] = await Promise.all([
                axios.get(`/applications`),
                axios.get(`/interviews`),
                axios.get(`/saved-jobs`)
            ])

            const applications = applicationsRes.data.data?.applications || []
            const interviews = interviewsRes.data.data?.interviews || []
            const savedJobs = savedJobsRes.data.data?.saved_jobs || []

            const now = new Date()
            const upcomingInterviews = interviews.filter(
                i => new Date(i.scheduled_at) > now
            ).length

            // Store the upcoming interviews list for the dashboard card
            const upcomingList = interviews
                .filter(i => new Date(i.scheduled_at) > now && i.status !== 'cancelled')
                .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
                .slice(0, 5)
            setUpcomingInterviewsList(upcomingList)

            setStats({
                totalApplications: applications.length,
                pendingApplications: applications.filter(a => a.status === 'pending').length,
                acceptedApplications: applications.filter(a => a.status === 'accepted').length,
                rejectedApplications: applications.filter(a => a.status === 'rejected').length,
                totalInterviews: interviews.length,
                upcomingInterviews,
                totalSavedJobs: savedJobs.length,
                loading: false
            })

            // Populate recent applications (limit 5)
            let recent = applications.slice(0, 5)

            // If any recent app is missing a company name, try to fetch hiring detail to extract company
            const missingCompanyApps = recent.filter(a => !(a.company && (a.company.name || a.company.company_name || a.company.companyName)) && a.hiring && a.hiring.id)
            if (missingCompanyApps.length > 0) {
                try {
                    const hiringIds = Array.from(new Set(missingCompanyApps.map(a => a.hiring.id)))
                    const hires = await Promise.all(hiringIds.map(id => axios.get(`/hirings/${id}`).catch(() => null)))
                    const hireMap = {}
                    hires.forEach((res, idx) => {
                        const id = hiringIds[idx]
                        if (res && res.data && res.data.data) {
                            hireMap[id] = res.data.data
                        }
                    })

                    recent = recent.map(a => {
                        if (!(a.company && (a.company.name || a.company.company_name || a.company.companyName)) && a.hiring && a.hiring.id) {
                            const hd = hireMap[a.hiring.id]
                            if (hd && hd.company) {
                                a.company = a.company || {}
                                a.company.name = hd.company.name || hd.company.company_name || a.company.name
                            }
                        }
                        return a
                    })
                } catch (e) {
                    // ignore and continue with whatever data we have
                }
            }

            setRecentApplications(recent)
        } catch (error) {
            console.error('Error fetching applicant stats:', error)
            setStats(prev => ({ ...prev, loading: false }))
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'text-green-600 bg-green-50'
            case 'rejected': return 'text-red-600 bg-red-50'
            case 'pending': return 'text-yellow-600 bg-yellow-50'
            case 'reviewing': return 'text-blue-600 bg-blue-50'
            case 'shortlisted': return 'text-purple-600 bg-purple-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="w-4 h-4" />
            case 'rejected': return <XCircle className="w-4 h-4" />
            case 'pending': return <Clock className="w-4 h-4" />
            case 'reviewing': return <TrendingUp className="w-4 h-4" />
            case 'shortlisted': return <CheckCircle className="w-4 h-4" />
            default: return null
        }
    }

    if (stats.loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#1A3C40]">
                    Welcome back, {user?.firstname}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your job search
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-600">Applications</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.pendingApplications} pending review
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Accepted</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.acceptedApplications}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.rejectedApplications} rejected
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <h3 className="text-sm font-medium text-gray-600">Interviews</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalInterviews}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {stats.upcomingInterviews} upcoming
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-orange-600" />
                        <h3 className="text-sm font-medium text-gray-600">Saved Jobs</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSavedJobs}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Jobs you're interested in
                    </p>
                </div>
            </div>

            {/* Upcoming Interviews */}
            {upcomingInterviewsList.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#1A3C40] flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Upcoming Interviews
                            </h3>
                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                {stats.upcomingInterviews} scheduled
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingInterviewsList.map((interview) => {
                            const scheduledAt = new Date(interview.scheduled_at)
                            const company = interview.application?.company
                            const hiring = interview.application?.hiring
                            const typeIcons = { video: <Video className="w-3.5 h-3.5" />, phone: <Clock className="w-3.5 h-3.5" />, 'in-person': <Building2 className="w-3.5 h-3.5" /> }
                            return (
                                <div key={interview.id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center text-center">
                                            <span className="text-xs font-bold text-purple-700 leading-none">
                                                {scheduledAt.toLocaleString('default', { month: 'short' }).toUpperCase()}
                                            </span>
                                            <span className="text-lg font-extrabold text-purple-900 leading-tight">
                                                {scheduledAt.getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {hiring?.job_title || interview.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {company?.name || 'Company'}
                                                    </p>
                                                </div>
                                                <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    interview.status === 'scheduled' ? 'bg-purple-50 text-purple-700' :
                                                    interview.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {typeIcons[interview.interview_type] || <Calendar className="w-3.5 h-3.5" />}
                                                    <span className="capitalize">{interview.interview_type}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {interview.duration_minutes && (
                                                    <span>{interview.duration_minutes} min</span>
                                                )}
                                                {interview.meeting_link && (
                                                    <a
                                                        href={interview.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[#00B8D4] hover:underline font-medium"
                                                    >
                                                        <Video className="w-3 h-3" /> Join meeting
                                                    </a>
                                                )}
                                                {interview.location && !interview.meeting_link && (
                                                    <span>{interview.location}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#1A3C40]">Recent Applications</h3>
                        <Link 
                            to="/applications" 
                            className="text-sm text-[#00B8D4] hover:underline font-medium"
                        >
                            View all
                        </Link>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentApplications.length > 0 ? (
                        recentApplications.map((application) => (
                            <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {application.company?.logo && (
                                                <img 
                                                    src={application.company.logo} 
                                                    alt={application.company.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {application.hiring?.job_title}
                                                    </h4>
                                                    <span className="text-sm text-gray-400">at</span>
                                                    <p className="text-sm text-gray-600 font-medium truncate max-w-[240px]">
                                                        {application.company?.name || application.company?.company_name || application.company?.companyName || 'Company'}
                                                    </p>
                                                </div>
                                                {application.hiring?.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {application.hiring.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{application.hiring?.hiring_type}</span>
                                            <span>•</span>
                                            <span>{application.hiring?.work_from}</span>
                                            <span>•</span>
                                            <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                        {getStatusIcon(application.status)}
                                        <span className="capitalize">{application.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="mb-4">No applications yet</p>
                            <Link 
                                to="/dashboard/find-jobs"
                                className="inline-block px-6 py-2.5 bg-[#1A3C40] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const RecruiterDashboard = () => {
    const { user } = useAuth()
    const { companies, selectedCompany, hasPrivilege } = useCompany()
    const { deleteHiring } = useHiring()
    const navigate = useNavigate()
    const canManage = hasPrivilege('can_manage_jobs')
    const canPost = hasPrivilege('can_post_jobs')
    const [stats, setStats] = useState({
        totalCompanies: 0,
        totalHirings: 0,
        openJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        loading: true
    })
    const [recentJobs, setRecentJobs] = useState([])

    useEffect(() => {
        fetchRecruiterStats()
    }, [selectedCompany])

    const fetchRecruiterStats = async () => {
        try {
            setStats(prev => ({ ...prev, loading: true }))
            
            // If a specific company is selected, fetch stats for that company
            if (selectedCompany) {
                const [hiringResponse] = await Promise.all([
                    axios.get(`/companies/${selectedCompany.id}/hiring`)
                ])

                // Backend returns paginated data: response.data.data contains pagination object with 'data' array
                const hiringsRaw = hiringResponse.data.data
                let hirings = []
                
                // Handle paginated response structure
                if (hiringsRaw && typeof hiringsRaw === 'object' && Array.isArray(hiringsRaw.data)) {
                    // Paginated response: { current_page, data: [...], total, ... }
                    hirings = hiringsRaw.data
                } else if (Array.isArray(hiringsRaw)) {
                    // Direct array response
                    hirings = hiringsRaw
                } else if (hiringsRaw && typeof hiringsRaw === 'object') {
                    // Other object structures
                    if (Array.isArray(hiringsRaw.hirings)) {
                        hirings = hiringsRaw.hirings
                    } else {
                        hirings = Object.values(hiringsRaw).filter(v => v && typeof v === 'object')
                    }
                }

                const now = new Date()

                // Filter out any null entries and entries without a valid closing_at
                const validHirings = hirings.filter(h => h && h.closing_at);

                const openJobsCount = validHirings.filter(h => {
                    const closing = new Date(h.closing_at);
                    return !isNaN(closing) && closing > now;
                }).length;

                const closedJobsCount = validHirings.filter(h => {
                    const closing = new Date(h.closing_at);
                    return !isNaN(closing) && closing <= now;
                }).length;

                setStats({
                    totalCompanies: companies.length,
                    totalHirings: hirings.length,
                    openJobs: openJobsCount,
                    closedJobs: closedJobsCount,
                    totalApplications: 0, // Will be implemented when applications endpoint is ready
                    pendingApplications: 0,
                    loading: false
                })

                const top = validHirings.slice(0, 5)
                // fetch application counts for recent jobs
                try {
                    const countPromises = top.map(h => axios.get(`/companies/${selectedCompany.id}/hiring/${h.id}/applications`, { params: { per_page: 1 } }).catch(() => null))
                    const countResults = await Promise.all(countPromises)
                    const topWithCounts = top.map((h, idx) => {
                        const res = countResults[idx]
                        const total = res && res.data && res.data.data && res.data.data.pagination ? res.data.data.pagination.total : (h.application_count || 0)
                        return { ...h, application_count: total }
                    })
                    setRecentJobs(topWithCounts)
                } catch (err) {
                    setRecentJobs(top)
                }
            } else {
                // Show aggregate stats for all companies the user has access to
                if (companies.length === 0) {
                    setStats({
                        totalCompanies: 0,
                        totalHirings: 0,
                        openJobs: 0,
                        closedJobs: 0,
                        totalApplications: 0,
                        pendingApplications: 0,
                        loading: false
                    })
                } else {
                    // Fetch hirings for all accessible companies in parallel
                    const hiringPromises = companies.map(c => axios.get(`/companies/${c.id}/hiring`).catch(err => null));
                    const responses = await Promise.all(hiringPromises);

                    // Normalize and flatten hirings from all responses
                    let allHirings = [];
                    responses.forEach(res => {
                        if (!res || !res.data) return;
                        const hiringsRaw = res.data.data;
                        if (!hiringsRaw) return;
                        
                        // Handle paginated response structure
                        if (hiringsRaw && typeof hiringsRaw === 'object' && Array.isArray(hiringsRaw.data)) {
                            // Paginated response: { current_page, data: [...], total, ... }
                            allHirings = allHirings.concat(hiringsRaw.data);
                        } else if (Array.isArray(hiringsRaw)) {
                            // Direct array response
                            allHirings = allHirings.concat(hiringsRaw);
                        } else if (hiringsRaw && typeof hiringsRaw === 'object') {
                            // Other object structures
                            if (Array.isArray(hiringsRaw.hirings)) {
                                allHirings = allHirings.concat(hiringsRaw.hirings);
                            } else {
                                allHirings = allHirings.concat(Object.values(hiringsRaw).filter(v => v && typeof v === 'object'));
                            }
                        }
                    });

                    const now = new Date();
                    const validHirings = allHirings.filter(h => h && h.closing_at);

                    const openJobsCount = validHirings.filter(h => {
                        const closing = new Date(h.closing_at);
                        return !isNaN(closing) && closing > now;
                    }).length;

                    const closedJobsCount = validHirings.filter(h => {
                        const closing = new Date(h.closing_at);
                        return !isNaN(closing) && closing <= now;
                    }).length;

                    setStats({
                        totalCompanies: companies.length,
                        totalHirings: allHirings.length,
                        openJobs: openJobsCount,
                        closedJobs: closedJobsCount,
                        totalApplications: 0,
                        pendingApplications: 0,
                        loading: false
                    })

                    const top = validHirings.slice(0, 5)
                    try {
                        const hiringPromises = top.map(h => axios.get(`/companies/${h.company_id || selectedCompany.id}/hiring/${h.id}/applications`, { params: { per_page: 1 } }).catch(() => null))
                        const hiringResults = await Promise.all(hiringPromises)
                        const topWithCounts = top.map((h, idx) => {
                            const res = hiringResults[idx]
                            const total = res && res.data && res.data.data && res.data.data.pagination ? res.data.data.pagination.total : (h.application_count || 0)
                            return { ...h, application_count: total }
                        })
                        setRecentJobs(topWithCounts)
                    } catch (err) {
                        setRecentJobs(top)
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching recruiter stats:', error)
            setStats(prev => ({ ...prev, loading: false }))
        }
    }

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A3C40]">
                    Recruiter Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    {selectedCompany 
                        ? `Managing ${selectedCompany.name}` 
                        : `Welcome back, ${user?.firstname}! Manage your company's hiring process`}
                </p>
            </div>

            {companies.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h3>
                    <p className="text-gray-500 mb-6">Create your first company to start posting jobs and managing applications</p>
                    <Link
                        to="/create-company"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition"
                    >
                        <Building2 className="w-5 h-5" />
                        Create Company
                    </Link>
                </div>
            ) : (
                <>
                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Building2}
                            title="Total Companies"
                            value={stats.totalCompanies}
                            subtitle="Companies you manage"
                            color="purple"
                        />
                        <StatCard
                            icon={Briefcase}
                            title="Total Hirings"
                            value={stats.loading ? '...' : stats.totalHirings}
                            subtitle="All job postings"
                            color="blue"
                        />
                        <StatCard
                            icon={CheckCircle}
                            title="Open Jobs"
                            value={stats.loading ? '...' : stats.openJobs}
                            subtitle="Currently accepting applications"
                            color="green"
                        />
                        <StatCard
                            icon={XCircle}
                            title="Closed Jobs"
                            value={stats.loading ? '...' : stats.closedJobs}
                            subtitle="Past deadline"
                            color="red"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            icon={Users}
                            title="Applications Received"
                            value={stats.loading ? '...' : stats.totalApplications}
                            subtitle="Total applications"
                            color="indigo"
                        />
                        <StatCard
                            icon={Clock}
                            title="Pending Review"
                            value={stats.loading ? '...' : stats.pendingApplications}
                            subtitle="Awaiting your review"
                            color="yellow"
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Response Rate"
                            value={stats.loading ? '...' : '0%'}
                            subtitle="Applications responded to"
                            color="teal"
                        />
                    </div>

                    {/* Recent Jobs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
                                <Link
                                    to="/dashboard/jobs"
                                    className="text-sm text-[#00B8D4] hover:text-[#0097a7] font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {stats.loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B8D4] mx-auto"></div>
                                    <p className="mt-4">Loading...</p>
                                </div>
                            ) : recentJobs.length > 0 ? (
                                <div className="space-y-4">
                                    {recentJobs.map((job) => (
                                        <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-[#00B8D4] transition-colors">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {job.job_title}
                                                    <span className="ml-2 text-sm font-medium text-gray-500">at {job.company?.name || job.company_name || job.company?.company_name || (selectedCompany && selectedCompany.name) || 'Company'}</span>
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span>{job.hiring_type}</span>
                                                    <span>•</span>
                                                    <span>{job.work_from}</span>
                                                    <span>•</span>
                                                    <span>{job.employment_type}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${new Date(job.closing_at) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
                                                    {new Date(job.closing_at) > new Date() ? 'Open' : 'Closed'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(job.posted_at).toLocaleDateString()}
                                                </p>
                                                { (canManage || canPost) && (
                                                    <div className="flex items-center justify-end gap-2 mt-3">
                                                        <button onClick={() => navigate(`/dashboard/jobs/${job.id}/applicants`)} className="px-3 py-1 text-sm text-[#00B8D4] hover:text-[#007a8a] font-medium flex items-center gap-2">
                                                            <span>Applicants</span>
                                                            <span className="inline-flex items-center justify-center px-2 py-0.5 bg-white text-sm font-bold rounded-full text-[#00B8D4] border border-[#00B8D4]">
                                                                {typeof job.application_count === 'number' ? job.application_count : (job.application_count || 0)}
                                                            </span>
                                                        </button>
                                                        {canManage && (
                                                            <>
                                                                <button onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"><Edit className="w-4 h-4"/>Edit</button>
                                                                <button onClick={async () => {
                                                                    if (!window.confirm('Are you sure you want to delete this posting?')) return;
                                                                    const res = await deleteHiring(selectedCompany.id, job.id);
                                                                    if (res.success) {
                                                                        // refresh stats
                                                                        fetchRecruiterStats()
                                                                    } else {
                                                                        alert(res.message || 'Failed to delete posting')
                                                                    }
                                                                }} className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2"><Trash2 className="w-4 h-4"/>Delete</button>
                                                                <button onClick={async () => {
                                                                    if (!window.confirm('Close this posting? This will stop accepting new applications.')) return;
                                                                    try {
                                                                        await axios.patch(`/companies/${selectedCompany.id}/hiring/${job.id}/close`);
                                                                        fetchRecruiterStats()
                                                                    } catch (err) {
                                                                        console.error('Failed to close hiring', err);
                                                                        alert('Failed to close posting');
                                                                    }
                                                                }} className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 font-medium">Close</button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="mb-4">No jobs posted yet</p>
                                    <Link
                                        to={selectedCompany ? '/dashboard/jobs/create' : '/create-company'}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition"
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        Post Your First Job
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to={selectedCompany ? '/dashboard/jobs/create' : '/create-company'}
                            className="bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <Briefcase className="w-8 h-8 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">Post a Job</h3>
                            <p className="text-white/90 text-sm">Create a new job posting</p>
                        </Link>
                        <Link
                            to="/dashboard/jobs"
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <CheckCircle className="w-8 h-8 text-[#00B8D4] mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Jobs</h3>
                            <p className="text-gray-500 text-sm">View and edit your postings</p>
                        </Link>
                        <Link
                            to="/dashboard/members"
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <Users className="w-8 h-8 text-[#00B8D4] mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Team Members</h3>
                            <p className="text-gray-500 text-sm">Manage your team</p>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

const SystemPanelDashboard = () => {
    const { user } = useAuth()

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1A3C40]">
                    System Panel - Welcome back, {user?.firstname}!
                </h1>
                <p className="text-gray-500 mt-1">
                    System administration and monitoring
                </p>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                        <p className="text-sm text-gray-500 mt-2">Registered users</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Active Companies</h3>
                        <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                        <p className="text-sm text-gray-500 mt-2">Companies with active postings</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Total Jobs</h3>
                        <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                        <p className="text-sm text-gray-500 mt-2">Job postings</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-4">System Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center py-4">
                            <p className="text-gray-600 mb-2">System monitoring and administration tools</p>
                            <button className="px-4 py-2 bg-[#1A3C40] text-white rounded-lg font-medium text-sm hover:opacity-90">
                                View System Logs
                            </button>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-gray-600 mb-2">Manage website settings and configuration</p>
                            <Link to="/system-settings">
                                <button className="px-4 py-2 bg-[#00B8D4] text-white rounded-lg font-medium text-sm hover:opacity-90">
                                    Website Settings
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
