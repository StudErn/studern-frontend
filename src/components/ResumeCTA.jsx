import React from 'react'
import resumeImage from '../assets/Resume Stand out.png'

const ResumeCTA = () => {
    return (
        <section className="bg-[#1A3C40] py-16 text-white overflow-hidden">
            <div className="container mx-auto px-4 flex items-center justify-between gap-8 flex-col md:flex-row">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-4">No resume? No problem.</h2>
                    <p className="text-lg mb-8 opacity-80 max-w-[400px] mx-auto md:mx-0">Let us help you create one or improve the one you've got.</p>
                    <button className="bg-[#2E8B99] text-white px-8 py-3 rounded-lg font-semibold text-base transition-transform hover:-translate-y-0.5 shadow-lg">Build My Resume</button>
                </div>
                <div className="flex-1 flex justify-center md:justify-end relative">
                    {/* Decorative elements behind the image could go here if needed, but assuming image has them or simplicity is preferred */}
                    <img
                        src={resumeImage}
                        alt="Resume Builder Illustration"
                        className="w-full max-w-[400px] object-contain relative z-10"
                    />
                </div>
            </div>
        </section>
    )
}

export default ResumeCTA
