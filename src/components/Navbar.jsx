import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="py-5 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold cursor-pointer no-underline">
                    <div className="relative">
                        <span className="text-primary text-3xl">Stud</span>
                        <span className="text-secondary text-3xl">Ern</span>
                        {/* Graduation Cap Icon */}
                        <div className="absolute -top-4 right-0 text-primary">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu - Centered Links */}
                <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
                    <Link to="/find-jobs" className="hover:text-primary transition-colors">Find Jobs</Link>
                    <a href="#find-internships" className="hover:text-primary transition-colors">Find Internships</a>
                    <a href="#my-jobs" className="hover:text-primary transition-colors">My Jobs</a>
                    <a href="#e-learning" className="hover:text-primary transition-colors">E-Learning</a>
                </div>

                {/* Right Side Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/signup" className="px-6 py-2.5 rounded-full font-bold text-sm bg-primary text-white hover:bg-opacity-90 transition-all">
                        Register
                    </Link>
                    <Link to="/login" className="px-6 py-2.5 rounded-full font-bold text-sm border border-gray-300 text-primary hover:border-primary transition-all bg-white">
                        Login
                    </Link>
                    <Link to="/post-job" className="px-6 py-2.5 rounded-full font-bold text-sm bg-secondary text-primary hover:bg-opacity-90 transition-all flex items-center gap-1">
                        Employers / Post Job <span>&rarr;</span>
                    </Link>
                </div>

                {/* Hamburger Menu Toggle (Mobile) */}
                <button className="flex flex-col gap-1.5 cursor-pointer md:hidden z-50 p-2" onClick={toggleMenu}>
                    <span className={`w-6 h-0.5 bg-primary rounded-sm transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-primary rounded-sm transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-primary rounded-sm transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <ul className="flex flex-col items-center gap-6 font-semibold text-xl text-gray-800">
                        <li><Link to="/find-jobs" onClick={() => setIsMenuOpen(false)}>Find Jobs</Link></li>
                        <li><a href="#find-internships" onClick={() => setIsMenuOpen(false)}>Find Internships</a></li>
                        <li><a href="#my-jobs" onClick={() => setIsMenuOpen(false)}>My Jobs</a></li>
                        <li><a href="#e-learning" onClick={() => setIsMenuOpen(false)}>E-Learning</a></li>
                    </ul>
                    <div className="flex flex-col gap-4 w-64">
                        <Link to="/signup" className="w-full py-3 rounded-full font-bold text-center bg-primary text-white" onClick={() => setIsMenuOpen(false)}>Register</Link>
                        <Link to="/login" className="w-full py-3 rounded-full font-bold text-center border border-gray-300 text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link to="/post-job" className="w-full py-3 rounded-full font-bold text-center bg-secondary text-primary" onClick={() => setIsMenuOpen(false)}>Employers / Post Job</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
