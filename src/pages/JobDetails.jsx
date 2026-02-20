import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { jobsData } from '../data/jobs'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useCompany } from '../contexts/CompanyContext'
import { Link } from 'react-router-dom'

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    const { user } = useAuth();
    const { companies, fetchUserCompanies, hasPrivilege } = useCompany();

    useEffect(() => {
        // Find job by ID (handling string/number types properly)
        const foundJob = jobsData.find(j => String(j.id) === String(id));
        setJob(foundJob);
        // Scroll to top when page opens
        window.scrollTo(0, 0);
        // If user is logged in, ensure their companies are loaded so we can
        // determine whether to show inline 'Fix' links for missing fields.
        if (user) {
            fetchUserCompanies();
        }
    }, [id]);

    if (!job) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-12 text-center text-gray-500">
                    Loading job details...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Main Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-[4px] shadow-sm p-8 md:p-12 mb-8">

                    {/* Header Section */}
                    <div className="mb-8">
                        {/* Logo */}
                        <div className="mb-4">
                            {job.logo ? (
                                <img src={job.logo} alt={job.company?.name || job.company} className="h-12 w-auto object-contain" />
                            ) : (
                                <div
                                    className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: job.logoBg || '#ccc' }}
                                >
                                    {job.logoText || (typeof job.company === 'string' ? job.company?.charAt(0) : job.company?.name?.charAt(0))}
                                </div>
                            )}
                        </div>

                        {/* Company Name */}
                        <h2 className="text-xl text-gray-800 font-medium mb-1">{job.company?.name || job.company}</h2>

                        {/* Title & Deadline Row */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <h1 className="text-3xl font-bold text-[#4A5AE8] leading-tight">{job.title}</h1>
                            <div className="text-gray-900 font-semibold whitespace-nowrap">
                                Application deadline <span className="text-gray-900">{job.deadline}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 mb-8" />

                    {/* Job Details Content */}
                    <div className="space-y-6">

                        {/* Vacancy */}
                        <div>
                            <h3 className="text-gray-900 font-bold mb-1 text-base">vacancy</h3>
                            <p className="text-gray-700">
                                {job.vacancy || (
                                    <span className="text-gray-400">
                                        Not specified
                                        {/** Show a small Fix link for company members who can manage jobs */}
                                        {companies && companies.length > 0 && hasPrivilege && hasPrivilege('can_manage_jobs') && (
                                            // Try to match the job's company by name to ensure the user belongs to the company
                                            (companies.some(c => c.name === (job.company?.name || job.company))) && (
                                                <Link to="/dashboard/jobs/create" className="ml-2 text-sm text-[#00B8D4] hover:underline">Fix</Link>
                                            )
                                        )}
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Additional Requirements */}
                        {job.additionalRequirements && job.additionalRequirements.length > 0 && (
                            <div>
                                <h3 className="text-gray-900 font-bold mb-2 text-base">Additional Requirements</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    {job.additionalRequirements.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Workplace */}
                        <div>
                            <h3 className="text-gray-900 font-bold mb-1 text-base">Workplace</h3>
                            <p className="text-gray-700">{job.workType}</p>
                        </div>

                        {/* Employment Status */}
                        <div>
                            <h3 className="text-gray-900 font-bold mb-1 text-base">Employment Status</h3>
                            <p className="text-gray-700">{job.jobType}</p>
                        </div>

                        {/* Gender */}
                        {job.gender && (
                            <div>
                                <h3 className="text-gray-900 font-bold mb-1 text-base">Gender</h3>
                                <p className="text-gray-700">{job.gender}</p>
                            </div>
                        )}

                        {/* Job Location */}
                        <div>
                            <h3 className="text-gray-900 font-bold mb-1 text-base">Job Location</h3>
                            <p className="text-gray-700">{job.location}</p>
                        </div>

                        {/* Skills */}
                        {job.skills && (
                            <div>
                                <h3 className="text-gray-900 font-bold mb-1 text-base">Skills & Expertise</h3>
                                <p className="text-gray-700">{job.skills}</p>
                            </div>
                        )}

                        {/* Salary */}
                        <div>
                            <h3 className="text-gray-900 font-bold mb-1 text-base">Salary Range</h3>
                            <p className="text-gray-700">{job.salary}</p>
                        </div>

                        {/* Apply Button */}
                        <div className="mt-8">
                            <button className="bg-[#155E63] text-white font-bold py-3 px-8 rounded-[8px] hover:opacity-90 transition-opacity">
                                Apply now
                            </button>
                        </div>

                    </div>

                    {/* Gray placeholder block from image (optional visual filler) */}
                    <div className="mt-8 h-32 bg-gray-100 rounded w-full"></div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default JobDetails
