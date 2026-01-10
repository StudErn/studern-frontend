import React from 'react'
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
            isInternship: true
        },
        {
            title: 'Internship - internship Contacts',
            company: '',
            location: 'work from office',
            salary: '10000-12000 / month',
            action: 'view details',
            logo: logoICI,
            isHighlighted: false,
            isInternship: true
        },
        {
            title: 'Client Acquisition Specialist',
            company: 'Pran-RFL Group',
            location: 'Work From Home',
            salary: '10000-12000 / month',
            action: 'view details',
            logo: logoPran,
            isHighlighted: false,
            isInternship: true
        }
    ]

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
                <div>
                    <h2 className="text-4xl font-bold mb-8 text-gray-900">Internships</h2>

                    {/* Filter Buttons */}
                    <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
                        <button className="px-8 py-2.5 rounded-full bg-[#375e63] text-white font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                            paid
                        </button>
                        <button className="px-8 py-2.5 rounded-full border border-[#375e63] text-[#375e63] bg-white font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                            unpaid
                        </button>
                        <button className="px-8 py-2.5 rounded-full bg-[#2E9CA5] text-white font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer">
                            Training
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internships.map((job, idx) => <JobCard key={idx} {...job} />)}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default JobsSection
