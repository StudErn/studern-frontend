import React from 'react'
import { Link } from 'react-router-dom'
import eventImg1 from '../assets/event section/Job Placement1.png'
import eventImg2 from '../assets/event section/Job Success.png'
import eventImg3 from '../assets/event section/Job Giving.png'

const EventsSection = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold mb-10 text-gray-900">Events</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card 1: Online Courses */}
                    <div className="rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-[#4DB6AC] to-[#E0E0E0] h-[350px] flex flex-col justify-between">
                        <div className="relative z-10">
                            <span className="inline-block bg-[#2A4D69] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                                Placement Guaranteed Courses
                            </span>
                            <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                                Online Courses with<br />
                                <span className="text-[#00FF88]">Guaranteed Placement</span>
                            </h3>
                        </div>
                        <div className="relative z-10">
                            <Link to="/courses" className="inline-block bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-bold px-6 py-2 rounded-lg hover:bg-white transition-colors">
                                Know more
                            </Link>
                        </div>

                        {/* Image positioning */}
                        <img
                            src={eventImg1}
                            alt="Placement Success"
                            className="absolute bottom-0 right-0 w-48 h-auto object-contain z-0"
                        />
                    </div>

                    {/* Card 2: Mega Internship Sprint */}
                    <div className="rounded-3xl p-8 relative overflow-hidden bg-[#1D5D63] h-[350px] flex flex-col">
                        <div className="relative z-10">
                            <span className="inline-block bg-[#15464B] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                                Internships
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Mega Internship Sprint
                            </h3>
                            <p className="text-white/90 text-sm mb-4">
                                Apply from StudErn for <span className="font-bold">premium internships</span>
                            </p>

                            <div className="flex flex-col gap-2 mb-6 items-start">
                                <span className="bg-white/20 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                                    Guaranteed Stipend
                                </span>
                                <span className="bg-white/20 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                                    Freshers Friendly Placement
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <Link to="/internship-sprint" className="inline-block bg-[#2A3B4D] text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                                Participate Now
                            </Link>
                        </div>

                        <img
                            src={eventImg2}
                            alt="Internship Sprint"
                            className="absolute bottom-4 right-4 w-40 h-auto object-contain z-0"
                        />
                    </div>

                    {/* Card 3: Intern Job Fair */}
                    <div className="rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-[#D4C392] to-[#E8DAB2] h-[350px] flex flex-col">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold text-white">StudErn</h4>
                                <span className="bg-[#1A237E] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                    Ongoing
                                </span>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-800 mb-1">
                                Intern <span className="border-2 border-white px-1 ml-1 text-white">Job Fair</span>
                            </h3>
                            <p className="text-gray-700 text-xs font-medium mb-4">
                                100+ Companies, 1000+ Students & Many ...
                            </p>

                            <div className="flex items-center gap-1 text-gray-700 text-sm font-bold mb-6">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                Dhaka
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <Link to="/job-fair" className="inline-block bg-white text-gray-900 text-xs font-bold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                                Register Now
                            </Link>
                        </div>

                        <img
                            src={eventImg3}
                            alt="Job Fair"
                            className="absolute bottom-0 right-0 w-44 h-auto object-contain z-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventsSection
