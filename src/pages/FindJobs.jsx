import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { jobsData } from '../data/jobs'

const FindJobs = () => {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';

    // Initialize searchQuery with the URL param if present
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const [filteredJobs, setFilteredJobs] = useState(jobsData);
    const [filters, setFilters] = useState({
        experience: [],
        jobType: [],
        workType: []
    });

    // Mobile filter drawer state
    const [showFilters, setShowFilters] = useState(false);

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

    useEffect(() => {
        let result = jobsData;

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(lowerQuery) ||
                job.company.toLowerCase().includes(lowerQuery) ||
                job.highlights.some(h => h.toLowerCase().includes(lowerQuery))
            );
        }

        if (filters.experience.length > 0) {
            result = result.filter(job => filters.experience.includes(job.experience));
        }
        if (filters.jobType.length > 0) {
            result = result.filter(job => filters.jobType.includes(job.jobType));
        }
        if (filters.workType.length > 0) {
            result = result.filter(job => filters.workType.includes(job.workType));
        }

        setFilteredJobs(result);
    }, [filters, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="text-center py-12 px-4 bg-white mb-8">
                <h1 className="text-3xl md:text-4xl text-gray-900 mb-2 font-bold">Find Your Next Opportunities</h1>
                <p className="text-gray-600 mb-8">Discover thousand of jobs and internships to launch your career</p>

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
                    {["UI/UX", "Frontend dev", "Backend dev", "Data analysis", "Graphic designer"].map((skill, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSearchQuery(skill)}
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
                    <div className="mb-4 text-gray-600">showing <strong>{filteredJobs.length}</strong> result</div>

                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                            <p>No jobs found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map(job => (
                                <div key={job.id} className="rounded-[20px] p-6 flex flex-col transition-transform hover:-translate-y-1 min-h-[300px]" style={{ backgroundColor: job.cardColor }}>
                                    <div className="mb-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: job.logoBg }}>
                                            {job.logoText}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-1 text-gray-900 leading-tight">{job.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{job.company}</p>

                                    <ul className="text-sm text-gray-700 mb-auto pl-2">
                                        {job.highlights.map((highlight, idx) => (
                                            <li key={idx} className="mb-1">• {highlight}</li>
                                        ))}
                                    </ul>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-xs text-gray-600 font-medium">📍 {job.workType}</span>
                                        <Link to={`/jobs/${job.id}`} className="bg-[#1a3c40] text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90">Apply now</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <button className="border border-gray-800 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-gray-100">See more options</button>
                    </div>
                </main>

            </div>

            <Footer />
        </div>
    )
}

export default FindJobs
