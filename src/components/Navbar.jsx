import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="py-4 relative z-50 bg-transparent">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold cursor-pointer no-underline">
                    <span className="text-primary">Stud</span><span className="text-secondary">Ern</span>
                </Link>

                {/* Hamburger Menu Toggle */}
                <div className="flex flex-col gap-1 cursor-pointer md:hidden" onClick={toggleMenu}>
                    <span className="w-6 h-0.5 bg-primary rounded-sm"></span>
                    <span className="w-6 h-0.5 bg-primary rounded-sm"></span>
                    <span className="w-6 h-0.5 bg-primary rounded-sm"></span>
                </div>

                {/* Navbar Menu */}
                <div className={`${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-5 pointer-events-none'} md:opacity-100 md:translate-y-0 md:pointer-events-auto absolute top-full left-0 right-0 bg-white md:bg-transparent shadow-lg md:shadow-none p-8 md:p-0 flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all duration-300 md:static md:flex`}>
                    <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-8 font-medium">
                        <li><Link to="/find-jobs" className="text-gray-900 hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>Find Jobs</Link></li>
                        <li><a href="#find-internships" className="text-gray-900 hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>Find Internships</a></li>
                        <li><a href="#my-jobs" className="text-gray-900 hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>My Jobs</a></li>
                        <li><a href="#e-learning" className="text-gray-900 hover:text-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>E-Learning</a></li>
                    </ul>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <Link to="/signup" className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:opacity-90 inline-block cursor-pointer bg-primary text-white text-center" onClick={() => setIsMenuOpen(false)}>Register</Link>
                        <Link to="/login" className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:opacity-90 inline-block cursor-pointer bg-transparent border border-gray-900 text-gray-900 text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <button className="px-6 py-2 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:opacity-90 inline-block cursor-pointer bg-secondary text-white border-none w-full md:w-auto" onClick={() => setIsMenuOpen(false)}>Employers / Post Jobs</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
