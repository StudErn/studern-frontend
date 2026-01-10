import React from 'react'

const JobCard = ({ title, company, type, location, salary, action, isInternship }) => (
    <div className="bg-white border border-secondary rounded-[20px] p-6 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-base font-bold mb-1">{title}</h3>
                <span className="text-sm text-gray-600">{company}</span>
            </div>
            <div>
                {/* Placeholder logo */}
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">LOG</div>
            </div>
        </div>

        <div className="mb-6 flex-1">
            <p className="text-sm mb-2 flex items-center gap-2 text-gray-700">
                <span>📍</span> {location}
            </p>
            <p className="text-sm mb-2 flex items-center gap-2 text-gray-700">
                <span>💰</span> {salary}
            </p>
        </div>

        <div className="mt-auto">
            {isInternship ? (
                <button className="text-primary font-semibold flex items-center gap-2 ml-auto">
                    {action} <span>→</span>
                </button>
            ) : (
                <button className="bg-[#00695c] text-white px-6 py-2 rounded font-semibold w-fit">
                    {action}
                </button>
            )}
        </div>
    </div>
)

const JobsSection = () => {
    const jobs = [
        { title: 'Client Acquisition Specialist', company: 'Non-IT Group', location: 'Work form home', salary: '12000 - 16000/Year', action: 'Apply Now' },
        { title: 'Internship - Internship Contacts', company: 'Partner', location: 'Work form home', salary: '10000 - 15000/Month', action: 'Apply Now' },
        { title: 'Internship - Internship Contacts', company: 'Partner', location: 'In office', salary: '10000 - 15000/Month', action: 'Apply Now' }
    ]

    const internships = [
        { title: 'Online courses with guaranteed internship', company: 'Learn', location: 'Work form home', salary: '10000 - 15000/Month', action: 'view details', isInternship: true },
        { title: 'Internship - Internship contacts', company: 'Partner', location: 'Work form office', salary: '10000 - 12000/Month', action: 'view details', isInternship: true },
        { title: 'Client Acquisition Specialist', company: 'Partner', location: 'Work form home', salary: '10000 - 12000/Month', action: 'view details', isInternship: true }
    ]

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">

                {/* Freshers Jobs */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Freshers Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.map((job, idx) => <JobCard key={idx} {...job} />)}
                    </div>
                </div>

                {/* Internships */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Internships</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
                            <button className="px-6 py-2 rounded-full border border-primary bg-primary text-white font-semibold transition-all whitespace-nowrap">paid</button>
                            <button className="px-6 py-2 rounded-full border border-gray-900 font-semibold transition-all whitespace-nowrap">unpaid</button>
                            <button className="px-6 py-2 rounded-full border border-secondary bg-secondary text-white font-semibold transition-all whitespace-nowrap">Training</button>
                        </div>
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
