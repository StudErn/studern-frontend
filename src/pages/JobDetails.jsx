import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  DollarSign,
  Calendar,
  Users,
  Share2,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE}/hirings/${id}`);
            setJob(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching job details:', err);
            setError('Job not found or has been removed.');
        } finally {
            setLoading(false);
        }
    };

    const getSalaryText = (job) => {
        if (!job) return 'Not specified';
        if (job.hiring_type === 'job' && job.job_detail) {
            const { min_salary, max_salary, currency, pay_per, payment_type } = job.job_detail;
            if (payment_type !== 'fixed_pay') return 'Performance Based';
            if (max_salary) return `${currency} ${min_salary?.toLocaleString()} – ${max_salary.toLocaleString()} / ${pay_per}`;
            return `${currency} ${min_salary?.toLocaleString()} / ${pay_per}`;
        }
        if (job.hiring_type === 'internship' && job.internship_detail) {
            const { min_stipend, max_stipend, currency, pay_per } = job.internship_detail;
            if (max_stipend) return `${currency} ${min_stipend?.toLocaleString()} – ${max_stipend.toLocaleString()} / ${pay_per}`;
            if (min_stipend) return `${currency} ${min_stipend?.toLocaleString()} / ${pay_per}`;
            return 'Unpaid / Learning Opportunity';
        }
        return 'Not specified';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] font-sans">
                <Navbar />
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{error || 'Job not found'}</h2>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="mt-4 text-[#00B8D4] hover:underline font-medium"
                    >
                        ← Browse all jobs
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A3C40] mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to jobs
                </button>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Main Column ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            {/* Company logo + name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-[#1A3C40]/5 flex items-center justify-center border border-[#1A3C40]/10 flex-shrink-0">
                                    <Building2 className="w-7 h-7 text-[#1A3C40]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{job.company?.name}</p>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{job.job_title}</h1>
                                </div>
                                <button className="ml-auto p-2 text-gray-400 hover:text-[#1A3C40] rounded-lg">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Key meta row */}
                            <div className="flex flex-wrap gap-4 py-5 border-t border-b border-gray-100 mb-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    <span className="capitalize font-medium text-gray-700">{job.hiring_type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-green-500" />
                                    <span className="capitalize font-medium text-gray-700">{job.work_from?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-purple-500" />
                                    <span className="capitalize font-medium text-gray-700">{job.employment_type?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-gray-700">{getSalaryText(job)}</span>
                                </div>
                                {job.num_of_openings && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-orange-400" />
                                        <span className="font-medium text-gray-700">{job.num_of_openings} opening{job.num_of_openings > 1 ? 's' : ''}</span>
                                    </div>
                                )}
                                {job.closing_at && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-red-400" />
                                        <span className="font-medium text-gray-700">Closes {new Date(job.closing_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {job.description && (
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 mb-3">Description</h2>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Job / Internship extras */}
                        {job.hiring_type === 'job' && job.job_detail && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-4">Job Details</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {job.job_detail.experience_year != null && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Experience</p>
                                            <p className="font-semibold text-gray-800">{job.job_detail.experience_year} yr{job.job_detail.experience_year !== 1 ? 's' : ''}</p>
                                        </div>
                                    )}
                                    {job.job_detail.perks?.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Perks & Benefits</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.job_detail.perks.map((perk, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize">
                                                        {perk.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {job.hiring_type === 'internship' && job.internship_detail && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-4">Internship Details</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {(job.internship_detail.duration_weeks || job.internship_detail.duration_months) && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Duration</p>
                                            <p className="font-semibold text-gray-800">
                                                {job.internship_detail.duration_months
                                                    ? `${job.internship_detail.duration_months} month${job.internship_detail.duration_months > 1 ? 's' : ''}`
                                                    : `${job.internship_detail.duration_weeks} week${job.internship_detail.duration_weeks > 1 ? 's' : ''}`}
                                            </p>
                                        </div>
                                    )}
                                    {job.internship_detail.when_to_start && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Start</p>
                                            <p className="font-semibold text-gray-800 capitalize">{job.internship_detail.when_to_start.replace(/_/g, ' ')}</p>
                                        </div>
                                    )}
                                    {job.internship_detail.perks?.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Perks</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.internship_detail.perks.map((perk, i) => (
                                                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium capitalize">
                                                        {perk.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Work-from details */}
                        {job.work_from_detail && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-4">Work Schedule</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {job.work_from_detail.timezone && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Timezone</p>
                                            <p className="font-semibold text-gray-800">{job.work_from_detail.timezone}</p>
                                        </div>
                                    )}
                                    {job.work_from_detail.work_start_time && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Hours</p>
                                            <p className="font-semibold text-gray-800">{job.work_from_detail.work_start_time} – {job.work_from_detail.work_end_time}</p>
                                        </div>
                                    )}
                                    {job.work_from_detail.days_in_office_per_week != null && (
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Days in office / week</p>
                                            <p className="font-semibold text-gray-800">{job.work_from_detail.days_in_office_per_week}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar Column ── */}
                    <div className="space-y-6">

                        {/* Apply Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Interested in this role?</h3>

                            {user ? (
                                <Link
                                    to={`/dashboard/find-jobs/${id}`}
                                    className="block w-full text-center py-3 bg-[#1A3C40] text-white rounded-lg font-bold hover:bg-[#1A3C40]/90 transition-all shadow-md hover:shadow-lg"
                                >
                                    Apply Now
                                </Link>
                            ) : (
                                <Link
                                    to={`/login?redirect=/jobs/${id}`}
                                    className="block w-full text-center py-3 bg-[#1A3C40] text-white rounded-lg font-bold hover:bg-[#1A3C40]/90 transition-all shadow-md hover:shadow-lg"
                                >
                                    Login to Apply
                                </Link>
                            )}

                            <div className="mt-5 pt-5 border-t border-gray-100 space-y-3 text-sm">
                                {job.posted_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Posted</span>
                                        <span className="font-medium text-gray-800">{new Date(job.posted_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {job.closing_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Deadline</span>
                                        <span className="font-medium text-gray-800">{new Date(job.closing_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {job.num_of_openings && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Openings</span>
                                        <span className="font-medium text-gray-800">{job.num_of_openings}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">About the Company</h3>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#1A3C40]/5 flex items-center justify-center border border-[#1A3C40]/10 flex-shrink-0">
                                    <Building2 className="w-5 h-5 text-[#1A3C40]" />
                                </div>
                                <span className="font-semibold text-gray-800">{job.company?.name}</span>
                            </div>

                            {job.company?.description ? (
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{job.company.description}</p>
                            ) : (
                                <p className="text-sm italic text-gray-400 mb-4">No description available.</p>
                            )}

                            {job.company?.industry_type && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                                    <span className="capitalize">{job.company.industry_type.replace(/_/g, ' ')}</span>
                                </div>
                            )}

                            {job.company?.number_of_employees && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span>{job.company.number_of_employees} employees</span>
                                </div>
                            )}

                            {job.company?.website && (
                                <a
                                    href={job.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-[#00B8D4] hover:underline font-medium mt-3"
                                >
                                    <Globe className="w-4 h-4" />
                                    Visit Website
                                </a>
                            )}

                            {job.company?.links?.filter(l => l.link_type !== 'website').length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {job.company.links.filter(l => l.link_type !== 'website').map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 capitalize"
                                        >
                                            {link.title || link.link_type}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default JobDetails;
