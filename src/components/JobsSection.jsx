import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Briefcase, MapPin, DollarSign, Building2, Clock } from 'lucide-react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';

// Skeleton Loader for Job Cards
const JobCardSkeleton = () => (
    <div className="rounded-xl p-6 flex flex-col h-full border bg-white border-gray-200 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-2">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-4 flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
);

// Enhanced Job Card with Dynamic Data
const JobCard = ({ hiring }) => {

    const getStatusBadge = () => {
        const now = new Date();
        const closing = new Date(hiring.closing_at);
        const isActive = closing > now;

        return isActive ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Active
            </span>
        ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                Closed
            </span>
        );
    };

    const isHighlighted = hiring.is_featured || false;

    return (
        <div className={`rounded-xl p-6 flex flex-col h-full border transition-all hover:shadow-lg hover:-translate-y-1 ${isHighlighted ? 'bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] border-[#00BCD4]' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-2">
                    <h3 className={`text-lg font-bold mb-1 leading-snug ${isHighlighted ? 'text-gray-900' : 'text-gray-800'}`}>
                        {hiring.job_title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-[#00BCD4]" />
                        <span className={`text-sm font-medium ${isHighlighted ? 'text-gray-700' : 'text-gray-600'}`}>
                            {hiring.company?.name || 'Unknown Company'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {getStatusBadge()}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${hiring.hiring_type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {hiring.hiring_type}
                    </span>
                </div>
            </div>

            <div className="mb-6 flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-[#00BCD4]" />
                    <span className="font-medium capitalize">{hiring.work_from || 'Remote'}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {hiring.employment_type}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    Closes: {new Date(hiring.closing_at).toLocaleDateString()}
                </div>
            </div>

            <div className="mt-auto">
                <Link 
                    to={`/jobs/${hiring.id}`} 
                    className={`w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all inline-block text-center ${
                        isHighlighted 
                            ? 'bg-[#00BCD4] text-white hover:bg-[#0097a7] shadow-md' 
                            : 'bg-gradient-to-r from-[#00BCD4] to-[#0097a7] text-white hover:shadow-lg'
                    }`}
                >
                    View Details →
                </Link>
            </div>
        </div>
    );
}


const JobsSection = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allHirings, setAllHirings] = useState([]);
    
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    // Fetch job listings from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${API_BASE}/hiring/browse`, {
                    params: {
                        per_page: 50,
                    }
                });

                const hirings = response.data?.data?.data || response.data?.data || [];
                setAllHirings(hirings);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err.message || 'Failed to load job listings');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs for freshers (jobs only, not internships)
    const freshersJobs = allHirings
        .filter(h => h.hiring_type === 'job')
        .slice(0, 6); // Show top 6 jobs

    // Filter internships
    const internships = allHirings.filter(h => h.hiring_type === 'internship');

    // Categorize internships by payment type
    const categorizedInternships = internships.map(intern => {
        let type = 'paid';
        if (intern.internship_detail) {
            if (!intern.internship_detail.min_stipend && !intern.internship_detail.max_stipend) {
                type = 'unpaid';
            } else if (intern.internship_detail.is_training) {
                type = 'training';
            }
        }
        return { ...intern, type };
    });

    // Apply filter
    const filteredInternships = activeFilter === 'all'
        ? categorizedInternships
        : categorizedInternships.filter(job => job.type === activeFilter);

    // Empty state component
    const EmptyState = ({ title, message, icon: Icon }) => (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto">{message}</p>
        </div>
    );



    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">

                {/* Error State */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-900">Failed to load job listings</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Freshers Jobs */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-4xl font-bold text-gray-900">Freshers Jobs</h2>
                        <Link 
                            to="/jobs" 
                            className="text-[#00BCD4] font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                        >
                            View All <span className="text-xl">→</span>
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, idx) => (
                                <JobCardSkeleton key={idx} />
                            ))}
                        </div>
                    ) : freshersJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {freshersJobs.map((job) => (
                                <JobCard key={job.id} hiring={job} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={Briefcase}
                            title="No Jobs Available"
                            message="We're currently updating our job listings. Check back soon for exciting opportunities!"
                        />
                    )}
                </div>

                {/* Internships */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-4xl font-bold text-gray-900">Internships</h2>

                        {/* Filter Buttons */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                                    activeFilter === 'all' 
                                        ? 'bg-[#00BCD4] text-white shadow-lg ring-2 ring-offset-2 ring-[#00BCD4]' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#00BCD4] hover:text-[#00BCD4]'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveFilter('paid')}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                                    activeFilter === 'paid' 
                                        ? 'bg-[#00796B] text-white shadow-lg ring-2 ring-offset-2 ring-[#00796B]' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#00796B] hover:text-[#00796B]'
                                }`}
                            >
                                Paid
                            </button>
                            <button
                                onClick={() => setActiveFilter('unpaid')}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                                    activeFilter === 'unpaid' 
                                        ? 'bg-[#455A64] text-white shadow-lg ring-2 ring-offset-2 ring-[#455A64]' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#455A64] hover:text-[#455A64]'
                                }`}
                            >
                                Unpaid
                            </button>
                            <button
                                onClick={() => setActiveFilter('training')}
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                                    activeFilter === 'training' 
                                        ? 'bg-[#0097a7] text-white shadow-lg ring-2 ring-offset-2 ring-[#0097a7]' 
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0097a7] hover:text-[#0097a7]'
                                }`}
                            >
                                Training
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, idx) => (
                                <JobCardSkeleton key={idx} />
                            ))}
                        </div>
                    ) : filteredInternships.length > 0 ? (
                        <div className="relative group">
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={32}
                                slidesPerView={1}
                                navigation
                                breakpoints={{
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                                className="pb-12 !px-4"
                            >
                                {filteredInternships.map((job) => (
                                    <SwiperSlide key={job.id} className="h-auto">
                                        <JobCard hiring={job} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ) : (
                        <EmptyState 
                            icon={Briefcase}
                            title={`No ${activeFilter === 'all' ? '' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Internships`}
                            message={`We don't have any ${activeFilter === 'all' ? '' : activeFilter} internship opportunities at the moment. Try a different filter or check back later.`}
                        />
                    )}
                </div>

                {/* Essentials Section */}
                <div>
                    <h2 className="text-4xl font-bold mb-10 text-gray-900">Essentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Essential Card 1 */}
                        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-full flex items-center justify-center mb-6 text-[#00BCD4]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Resume Build</h3>
                            <p className="text-gray-600 mb-6 text-sm">Create a professional resume in minutes with our easy-to-use builder.</p>
                            <button className="text-[#00BCD4] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Create Now <span className="text-lg">→</span>
                            </button>
                        </div>

                        {/* Essential Card 2 */}
                        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#E0F2F1] to-[#B2DFDB] rounded-full flex items-center justify-center mb-6 text-[#009688]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Career Counselling</h3>
                            <p className="text-gray-600 mb-6 text-sm">Get expert guidance to navigate your career path and achieve your goals.</p>
                            <Link to="/book-session" className="text-[#009688] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Book Session <span className="text-lg">→</span>
                            </Link>
                        </div>

                        {/* Essential Card 3 */}
                        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] rounded-full flex items-center justify-center mb-6 text-[#FFA000]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Skill Test</h3>
                            <p className="text-gray-600 mb-6 text-sm">Assess your skills and earn badges to showcase on your profile.</p>
                            <button className="text-[#FFA000] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Take Test <span className="text-lg">→</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default JobsSection
