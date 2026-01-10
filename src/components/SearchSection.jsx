import React from 'react'
import './SearchSection.css'

const SearchSection = () => {
    return (
        <section className="search-section">
            <div className="container search-container">
                <h2 className="search-title">
                    Find the <span className="highlight">right</span> fit.
                </h2>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search jobs, internships, keywords"
                        className="search-input"
                    />
                    <button className="search-btn">
                        {/* Simple SVG search icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                <div className="popular-searches">
                    <span className="popular-label">popular searches</span>
                    <div className="chips">
                        <button className="chip">work from Home</button>
                        <button className="chip">part-time</button>
                        <button className="chip">Customer service</button>
                        <button className="chip">IT</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchSection
