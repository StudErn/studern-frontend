import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/find-jobs?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleTagClick = (tag) => {
        navigate(`/find-jobs?query=${encodeURIComponent(tag)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="bg-[#A8D1D1] py-16 text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 font-sans">
                    Find the <span className="text-[#FFD700]">right</span> fit.
                </h2>

                <div className="max-w-[700px] mx-auto bg-white flex items-center p-0 rounded shadow-md mb-8">
                    <input
                        type="text"
                        placeholder="Search jobs, internships, keywords"
                        className="flex-1 px-6 py-4 text-gray-700 outline-none border-none text-lg h-14 bg-transparent placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-[#FFD700] w-16 h-14 flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
                        onClick={handleSearch}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <span className="font-bold text-gray-800 text-sm tracking-wide">popular searches</span>
                    <div className="flex flex-wrap justify-center gap-3">
                        {["work from Home", "part-time", "Customer service", "IT"].map((tag, idx) => (
                            <button
                                key={idx}
                                className="px-6 py-2 rounded-full border border-gray-400/50 bg-[#94C3C3] text-[#1F2937] text-sm font-semibold hover:bg-[#86Bebc] transition-colors cursor-pointer shadow-sm"
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchSection
