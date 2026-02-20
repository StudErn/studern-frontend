import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { Briefcase, MapPin, DollarSign, Building2, Clock } from 'lucide-react'

const FindJobs = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // Redirect to dashboard if user is logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true })
        }
    }, [isAuthenticated, navigate])

    // Initialize searchQuery with the URL param if present
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trendingSkills, setTrendingSkills] = useState([]);
    const [filters, setFilters] = useState({
        experience: [],
        jobType: [],
        workType: []
    });

    // Mobile filter drawer state
    const [showFilters, setShowFilters] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    
    const location = useLocation();

    // Determine whether this page should show internships or jobs
    const isInternshipsPage = location.pathname.includes('intern') || location.pathname.includes('internships') || location.pathname.includes('find-internships');
    const pageLabel = isInternshipsPage ? 'Internships' : 'Jobs';

    // Fetch jobs/internships from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${API_BASE}/hiring/browse`, {
                    params: {
                        hiring_type: isInternshipsPage ? 'internship' : 'job',
                        per_page: 100,
                    }
                });

                const jobs = response.data?.data?.data || response.data?.data || [];
                setAllJobs(jobs);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err.message || 'Failed to load listings');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [location.pathname]);


    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const categoryFilters = prev[category];
            if (categoryFilters.includes(value)) {
                return { ...prev, [category]: categoryFilters.filter(item => item !== value) };
            } else {
                return { ...prev, [category]: [...categoryFilters, value] };
            }
        });
    };

    const clearAllFilters = () => {
        setFilters({
            experience: [],
            jobType: [],
            workType: []
        });
        setSearchQuery('');
    };
    
    // Map backend data to match filter expectations
    const mapJobToFilters = (job) => {
        let experience = 'Freshers';
        if (job.job_detail?.experience_year) {
            const years = job.job_detail.experience_year;
            if (years < 1) experience = 'Freshers';
            else if (years === 1) experience = '< 1 year';
            else if (years <= 2) experience = '1-2 years';
        }
        
        let jobType = job.employment_type === 'full-time' ? 'Fulltime' : 
                      job.employment_type === 'part-time' ? 'Part time' : 'Fulltime';
        
        let workType = job.work_from === 'remote' ? 'Remote' :
                       job.work_from === 'onsite' ? 'On site' :
                       job.work_from === 'hybrid' ? 'Hybrid' : 'Remote';
        
        return { experience, jobType, workType };
    };


    useEffect(() => {
        let result = [...allJobs];

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.job_title?.toLowerCase().includes(lowerQuery) ||
                job.company?.name?.toLowerCase().includes(lowerQuery) ||
                job.description?.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply experience filter
        if (filters.experience.length > 0) {
            result = result.filter(job => {
                const mapped = mapJobToFilters(job);
                return filters.experience.includes(mapped.experience);
            });
        }
        
        // Apply job type filter
        if (filters.jobType.length > 0) {
            result = result.filter(job => {
                const mapped = mapJobToFilters(job);
                return filters.jobType.includes(mapped.jobType);
            });
        }
        
        // Apply work type filter
        if (filters.workType.length > 0) {
            result = result.filter(job => {
                const mapped = mapJobToFilters(job);
                return filters.workType.includes(mapped.workType);
            });
        }

        setFilteredJobs(result);
    }, [allJobs, filters, searchQuery]);

    // Compute trending skills from fetched listings
    useEffect(() => {
        if (!allJobs || allJobs.length === 0) {
            setTrendingSkills([]);
            return;
        }

        const counts = {};
        const add = (term) => {
            if (!term || typeof term !== 'string') return;
            const t = term.trim().toLowerCase();
            if (t.length < 3) return;
            counts[t] = (counts[t] || 0) + 1;
        };

        allJobs.forEach(job => {
            // Prefer explicit highlights/tags if available
            if (Array.isArray(job.highlights)) {
                job.highlights.forEach(h => add(h));
            }
            // job.skills may be a comma-separated string
            if (job.skills && typeof job.skills === 'string') {
                job.skills.split(',').forEach(s => add(s));
            }
            // Fallback to job title tokens
            if (job.job_title) {
                job.job_title.split(/[\s\/,-]+/).forEach(tok => add(tok));
            }
        });

        const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        const top = sorted.slice(0, 6).map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        setTrendingSkills(top);
    }, [allJobs]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="text-center py-12 px-4 bg-white mb-8">
                <h1 className="text-3xl md:text-4xl text-gray-900 mb-2 font-bold">Find Your Next {pageLabel}</h1>
                <p className="text-gray-600 mb-8">Discover thousands of {pageLabel.toLowerCase()} to launch your career</p>

                <div className="max-w-[600px] mx-auto flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg md:rounded-full p-2 shadow-sm mb-8 gap-2 md:gap-0">
                    <span className="ml-4 mr-2 text-gray-400 hidden md:block">🔍</span>
                    <input
                        type="text"
                        placeholder="Job title keyword or skill"
                        className="flex-1 border-none outline-none text-base w-full p-2 md:p-0 border-b border-gray-100 md:border-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold w-full md:w-auto hover:opacity-90 transition-opacity">search</button>
                </div>

                <div className="flex justify-center gap-2 items-center flex-wrap">
                    <span className="font-semibold mr-2">Trending skill:</span>
                    {(trendingSkills.length > 0 ? trendingSkills : ["UI/UX","Frontend dev","Backend dev","Data analysis","Graphic designer"]).map((skill, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setSearchQuery(skill); setShowFilters(false); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border-none mb-2 transition-colors cursor-pointer ${searchQuery.toLowerCase() === skill.toLowerCase() ? 'bg-indigo-50 text-indigo-600 border border-indigo-600 ring-1 ring-indigo-600' : 'bg-gray-100 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600'}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-16 relative container mx-auto px-4 flex-1">

                {/* Filter Toggle for Mobile */}
                <button
                    className="md:hidden mb-4 padding-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-semibold w-full"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? 'Close Filters' : 'Show Filters'}
                </button>

                <aside className={`w-full md:w-[250px] bg-white rounded-2xl p-6 border border-gray-100 h-fit shadow-sm transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg flex items-center gap-2 font-bold">
                            <span className="text-sm">⚡</span> Filters
                        </h3>
                        <button className="text-[#4A5AE8] text-xs font-semibold hover:underline" onClick={clearAllFilters}>Clear all</button>
                    </div>

                    <div className="mb-6 border-b border-gray-100 pb-4 last:border-0">
                        <h4 className="text-sm text-[#4A5AE8] mb-3 font-semibold">Experienced level</h4>
                        {["Freshers", "< 1 year", "1-2 years"].map(exp => (
                            <label key={exp} className="flex items-center gap-2 mb-2 text-sm text-gray-700 cursor-pointer hover:text-primary">
                                <input
                                    type="checkbox"
                                    checked={filters.experience.includes(exp)}
                                    onChange={() => handleFilterChange('experience', exp)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                /> {exp}
                            </label>
                        ))}
                    </div>

                    <div className="mb-6 border-b border-gray-100 pb-4 last:border-0">
                        <h4 className="text-sm text-[#4A5AE8] mb-3 font-semibold">Job-type</h4>
                        {["Part time", "Fulltime"].map(type => (
                            <label key={type} className="flex items-center gap-2 mb-2 text-sm text-gray-700 cursor-pointer hover:text-primary">
                                <input
                                    type="checkbox"
                                    checked={filters.jobType.includes(type)}
                                    onChange={() => handleFilterChange('jobType', type)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                /> {type}
                            </label>
                        ))}
                    </div>

                    <div className="mb-6 border-b border-gray-100 pb-4 last:border-0">
                        <h4 className="text-sm text-[#4A5AE8] mb-3 font-semibold">Work-type</h4>
                        {["Remote", "On site", "Hybrid"].map(type => (
                            <label key={type} className="flex items-center gap-2 mb-2 text-sm text-gray-700 cursor-pointer hover:text-primary">
                                <input
                                    type="checkbox"
                                    checked={filters.workType.includes(type)}
                                    onChange={() => handleFilterChange('workType', type)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                /> {type}
                            </label>
                        ))}
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="mb-4 text-gray-500 text-sm">
                        Showing <strong className="text-gray-700">{loading ? '…' : filteredJobs.length}</strong> {pageLabel.toLowerCase()}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-20" />
                                        <div className="h-6 bg-gray-200 rounded-full w-16" />
                                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-3 bg-gray-200 rounded w-full" />
                                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <div className="h-3 bg-gray-200 rounded w-32" />
                                        <div className="h-9 bg-gray-200 rounded-full w-28" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
                            <p className="text-red-500 font-medium">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-3 text-sm text-[#00B8D4] hover:underline">Try again</button>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-700 font-semibold">No {pageLabel.toLowerCase()} found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term</p>
                            <button onClick={clearAllFilters} className="mt-4 text-sm text-[#00B8D4] hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {filteredJobs.map(job => {
                                const detail = job.job_detail || job.internship_detail;
                                const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : null) || 'Company';
                                const postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
                                const closingDate = job.closing_at ? new Date(job.closing_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
                                return (
                                    <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                        {/* Header */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                {job.company?.logo ? (
                                                    <img src={job.company.logo} alt={companyName} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-[#1A3C40] flex items-center justify-center text-white font-bold text-lg">
                                                        {companyName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{companyName}</p>
                                                <h3 className="text-base font-bold text-gray-900 mt-0.5 leading-snug">{job.job_title}</h3>
                                            </div>
                                            {job.hiring_type === 'internship' && (
                                                <span className="flex-shrink-0 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">Internship</span>
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {job.employment_type && (
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">{job.employment_type.replace(/_/g, ' ')}</span>
                                            )}
                                            {job.work_from && (
                                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full capitalize">📍 {job.work_from.replace(/_/g, ' ')}</span>
                                            )}
                                            {job.num_of_openings > 0 && (
                                                <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">👥 {job.num_of_openings} opening{job.num_of_openings > 1 ? 's' : ''}</span>
                                            )}
                                            {detail?.experience_year !== undefined && (
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">🎓 {detail.experience_year}+ yr exp</span>
                                            )}
                                            {detail?.duration_months && (
                                                <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">📅 {detail.duration_months} months</span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {job.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{job.description}</p>
                                        )}

                                        {/* Compensation */}
                                        {(detail?.min_salary || detail?.min_stipend) && (
                                            <p className="text-sm font-semibold text-[#1A3C40]">
                                                💰 {detail.currency || 'BDT'} {(detail.min_salary || detail.min_stipend)?.toLocaleString()}
                                                {(detail.max_salary || detail.max_stipend) ? ` – ${(detail.max_salary || detail.max_stipend)?.toLocaleString()}` : ''}
                                                <span className="font-normal text-gray-400"> / {detail.pay_per || 'month'}</span>
                                            </p>
                                        )}

                                        {/* Perks preview */}
                                        {detail?.perks?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {detail.perks.slice(0, 3).map((perk, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-[#1A3C40]/5 text-[#1A3C40] text-xs rounded-full">✓ {perk}</span>
                                                ))}
                                                {detail.perks.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">+{detail.perks.length - 3} more</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                            <span className="text-xs text-gray-400">
                                                {postedDate && `Posted ${postedDate}`}{closingDate && ` · Closes ${closingDate}`}
                                            </span>
                                            <button
                                                onClick={() => setSelectedJob(job)}
                                                className="px-5 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-full hover:bg-[#1A3C40]/90 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

            </div>

            {/* Detail Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={() => setSelectedJob(null)}>
                    <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 flex items-start gap-4 rounded-t-3xl sm:rounded-t-2xl z-10">
                            {selectedJob.company?.logo ? (
                                <img src={selectedJob.company.logo} alt={selectedJob.company?.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-[#1A3C40] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {(selectedJob.company?.name || (typeof selectedJob.company === 'string' ? selectedJob.company : null) || 'C').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{selectedJob.company?.name || selectedJob.company}</p>
                                <h2 className="text-xl font-bold text-gray-900 mt-0.5">{selectedJob.job_title}</h2>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {selectedJob.hiring_type && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full capitalize">{selectedJob.hiring_type}</span>}
                                    {selectedJob.employment_type && <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full capitalize">{selectedJob.employment_type.replace(/_/g, ' ')}</span>}
                                    {selectedJob.work_from && <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full capitalize">{selectedJob.work_from.replace(/_/g, ' ')}</span>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none p-1 flex-shrink-0">×</button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-5">
                            {(() => {
                                const d = selectedJob.job_detail || selectedJob.internship_detail;
                                return (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {selectedJob.num_of_openings > 0 && (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">Openings</p>
                                                <p className="font-bold text-gray-900">{selectedJob.num_of_openings}</p>
                                            </div>
                                        )}
                                        {d?.experience_year !== undefined && (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">Experience</p>
                                                <p className="font-bold text-gray-900">{d.experience_year}+ years</p>
                                            </div>
                                        )}
                                        {d?.duration_months && (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">Duration</p>
                                                <p className="font-bold text-gray-900">{d.duration_months} months</p>
                                            </div>
                                        )}
                                        {(d?.min_salary || d?.min_stipend) && (
                                            <div className="bg-[#1A3C40]/5 rounded-xl p-3 border border-[#1A3C40]/10">
                                                <p className="text-xs text-gray-400 mb-1">{selectedJob.hiring_type === 'internship' ? 'Stipend' : 'Salary'}</p>
                                                <p className="font-bold text-[#1A3C40] text-sm">
                                                    {d.currency || 'BDT'} {(d.min_salary || d.min_stipend)?.toLocaleString()}
                                                    {(d.max_salary || d.max_stipend) ? `–${(d.max_salary || d.max_stipend)?.toLocaleString()}` : ''}
                                                    <span className="font-normal text-gray-400 text-xs"> / {d.pay_per || 'month'}</span>
                                                </p>
                                            </div>
                                        )}
                                        {selectedJob.closing_at && (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">Deadline</p>
                                                <p className="font-bold text-gray-900 text-sm">{new Date(selectedJob.closing_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        )}
                                        {selectedJob.posted_at && (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">Posted</p>
                                                <p className="font-bold text-gray-900 text-sm">{new Date(selectedJob.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {selectedJob.description && (
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">About the Role</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                                </div>
                            )}

                            {(selectedJob.job_detail?.perks?.length > 0 || selectedJob.internship_detail?.perks?.length > 0) && (
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Perks & Benefits</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedJob.job_detail?.perks || selectedJob.internship_detail?.perks || []).map((perk, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-[#1A3C40]/5 text-[#1A3C40] text-sm rounded-full border border-[#1A3C40]/10">✓ {perk}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                            <button onClick={() => setSelectedJob(null)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                Close
                            </button>
                            {isAuthenticated ? (
                                <button className="px-6 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors">
                                    Apply Now
                                </button>
                            ) : (
                                <Link
                                    to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
                                    className="px-6 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors"
                                >
                                    Login to Apply
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default FindJobs
