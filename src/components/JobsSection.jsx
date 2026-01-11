import React from 'react'
import { Link } from 'react-router-dom'
import logoPran from '../assets/Company job logos/Pran.png'
import logoStartech from '../assets/Company job logos/Startech.png'
import logoUnited from '../assets/Company job logos/United.png'
import logoICI from '../assets/Company job logos/ICI.png'

const JobCard = ({ title, company, location, salary, action, isHighlighted, logo, isInternship }) => (
    <div className={`rounded-[30px] p-6 flex flex-col h-full border ${isHighlighted ? 'bg-[#A8D1D1] border-transparent' : 'bg-white border-[#00BCD4]'} shadow-sm transition-transform hover:-translate-y-1`}>
        <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-2">
                <h3 className={`text-lg font-bold mb-1 leading-snug ${isHighlighted ? 'text-gray-900' : 'text-gray-800'}`}>{title}</h3>
                <span className={`text-sm ${isHighlighted ? 'text-gray-700' : 'text-[#FF7F50]'}`}>{company}</span>
            </div>
            <div className="flex-shrink-0">
                <img src={logo} alt={`${company} logo`} className="h-10 w-auto object-contain" />
            </div>
        </div>

        <div className="mb-8 flex-1">
            <p className="text-sm mb-3 flex items-center gap-2 font-medium text-gray-800">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {location}
            </p>
            <p className="text-sm mb-2 flex items-center gap-2 font-medium text-[#FF8F00]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                {salary}
            </p>
        </div>

        <div className="mt-auto">
            {isInternship ? (
                <button className="text-[#155e63] font-bold text-sm flex items-center gap-1 ml-auto hover:gap-2 transition-all cursor-pointer">
                    {action} <span className="text-lg">→</span>
                </button>
            ) : (
                <button className={`${isHighlighted ? 'bg-[#155e63]' : 'bg-[#155e63]'} text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer`}>
                    {action}
                </button>
            )}
        </div>
    </div>
)

const JobsSection = () => {
    const [activeFilter, setActiveFilter] = React.useState('all');

    const freshersJobs = [
        {
            title: 'Client Acquisition Specialist',
            company: 'Pran-RFL Group',
            location: 'Work From Home',
            salary: '12000-25000 / Year',
            action: 'Apply Now',
            logo: logoPran,
            isHighlighted: true
        },
        {
            title: 'Internship - internship Contacts',
            company: '',
            location: 'Work From Home',
            salary: '6000-7000 / month',
            action: 'Apply Now',
            logo: logoStartech,
            isHighlighted: false
        },
        {
            title: 'Internship - internship Contacts',
            company: '',
            location: 'work from office',
            salary: '10000-12000 / month',
            action: 'Apply Now',
            logo: logoUnited,
            isHighlighted: false
        }
    ]

    const internships = [
        {
            title: 'Online courses with guaranteed interviews',
            company: '',
            location: 'Work From Home',
            salary: '10000-15000 / month',
            action: 'view details',
            logo: logoStartech,
            isHighlighted: false,
            isInternship: true,
            type: 'training'
        },
        {
            title: 'Internship - internship Contacts',
            company: '',
            location: 'work from office',
            salary: 'Unpaid',
            action: 'view details',
            logo: logoICI,
            isHighlighted: false,
            isInternship: true,
            type: 'unpaid'
        },
        {
            title: 'Client Acquisition Specialist',
            company: 'Pran-RFL Group',
            location: 'Work From Home',
            salary: '10000-12000 / month',
            action: 'view details',
            logo: logoPran,
            isHighlighted: false,
            isInternship: true,
            type: 'paid'
        },
        {
            title: 'Junior Web Developer',
            company: 'Tech Solutions',
            location: 'Remote',
            salary: '15000-20000 / month',
            action: 'view details',
            logo: logoStartech,
            isHighlighted: false,
            isInternship: true,
            type: 'paid'
        }
    ]

    const filteredInternships = activeFilter === 'all'
        ? internships
        : internships.filter(job => job.type === activeFilter);

    // Helper to get button style based on type and active state
    // Preserving the visual style from the user's image while adding active state indication
    const getButtonStyle = (type, baseClasses, activeClasses) => {
        return activeFilter === type
            ? `${baseClasses} ring-2 ring-offset-2 ring-[#00BCD4]`
            : `${baseClasses} opacity-80 hover:opacity-100`;
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">

                {/* Freshers Jobs */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold mb-10 text-gray-900">Freshers Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {freshersJobs.map((job, idx) => <JobCard key={idx} {...job} />)}
                    </div>
                </div>

                {/* Internships */}
                <div className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-4xl font-bold text-gray-900">Internships</h2>

                        {/* Filter Buttons */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'paid' ? 'all' : 'paid')}
                                className={`px-8 py-2.5 rounded-full bg-[#375e63] text-white font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeFilter === 'paid' ? 'ring-2 ring-offset-2 ring-[#375e63]' : 'hover:opacity-90'}`}
                            >
                                paid
                            </button>
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'unpaid' ? 'all' : 'unpaid')}
                                className={`px-8 py-2.5 rounded-full border border-[#375e63] text-[#375e63] bg-white font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeFilter === 'unpaid' ? 'bg-gray-100 ring-2 ring-offset-2 ring-[#375e63]' : 'hover:bg-gray-50'}`}
                            >
                                unpaid
                            </button>
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'training' ? 'all' : 'training')}
                                className={`px-8 py-2.5 rounded-full bg-[#2E9CA5] text-white font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeFilter === 'training' ? 'ring-2 ring-offset-2 ring-[#2E9CA5]' : 'hover:opacity-90'}`}
                            >
                                Training
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredInternships.map((job, idx) => <JobCard key={idx} {...job} />)}
                        {filteredInternships.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No internships found for this filter.
                            </div>
                        )}
                    </div>
                </div>

                {/* Essentials Section */}
                <div>
                    <h2 className="text-4xl font-bold mb-10 text-gray-900">Essentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Essential Card 1 */}
                        <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#E0F7FA] rounded-full flex items-center justify-center mb-6 text-[#00BCD4]">
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
                        <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-6 text-[#009688]">
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
                        <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mb-6 text-[#FFC107]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Skill Test</h3>
                            <p className="text-gray-600 mb-6 text-sm">Assess your skills and earn badges to showcase on your profile.</p>
                            <button className="text-[#FFC107] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
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
