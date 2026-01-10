import React from 'react'

const ResumeCTA = () => {
    return (
        <section className="bg-[#1A3C40] py-16 text-white overflow-hidden">
            <div className="container mx-auto px-4 flex items-center justify-between gap-8 flex-col md:flex-row">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-4">No resume? No problem.</h2>
                    <p className="text-lg mb-8 opacity-80 max-w-[400px] mx-auto md:mx-0">Taking your career to the next level is easier than you think.</p>
                    <button className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold text-base transition-transform hover:-translate-y-0.5">Build My Resume</button>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    {/* CSS based CV illustration converted to Tailwind */}
                    <div className="w-[200px] h-[280px] bg-white relative rounded p-5 rotate-3 shadow-2xl transform">
                        <div className="h-2.5 bg-gray-800 w-1/2 mb-5"></div>
                        <div className="absolute top-5 right-5 w-12 h-12 bg-gray-200 rounded"></div>
                        <div className="flex flex-col gap-2.5">
                            <div className="h-2 bg-gray-200 w-full rounded"></div>
                            <div className="h-2 bg-gray-200 w-[70%] rounded"></div>
                            <div className="h-2 bg-gray-200 w-full rounded"></div>
                            <div className="h-2 bg-gray-200 w-full rounded mt-4"></div>
                            <div className="h-2 bg-gray-200 w-[60%] rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResumeCTA
