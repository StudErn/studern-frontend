import React from 'react'
import { Link } from 'react-router-dom'
import loginImage from '../assets/loginimages.png'

const Login = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <Link to="/" className="text-[#1A3C40] text-sm font-bold no-underline hover:underline">Go to Home</Link>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-center gap-8 lg:gap-20 flex-col md:flex-row">
                {/* Left Side Illustration */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <img src={loginImage} alt="Login Illustration" className="w-full max-w-[500px] object-contain" />
                </div>

                {/* Right Side Form */}
                <div className="flex-1 w-full max-w-[450px] p-4 md:p-8">
                    {/* Logo */}
                    <div className="text-center mb-10 flex items-center justify-center relative">
                        <div className="relative inline-block">
                            <span className="text-[#1F2040] text-4xl font-bold">Stud</span>
                            <span className="text-[#00B8D4] text-4xl font-bold">Ern</span>
                            {/* Graduation Cap Icon - absolute positioned to match Navbar style roughly or integrated */}
                            <div className="absolute -top-3 -right-4 text-[#1F2040]">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div className="w-full">
                            <input type="text" placeholder="Email or Username" className="w-full p-4 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#00B8D4] outline-none placeholder-gray-400 transition-all font-medium" />
                        </div>

                        <div className="w-full">
                            <input type="password" placeholder="Password" className="w-full p-4 px-5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-1 focus:ring-[#00B8D4] outline-none placeholder-gray-400 transition-all font-medium" />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-[#1F2040] text-sm font-bold no-underline hover:underline opacity-80">Forget password?</a>
                        </div>

                        <button type="submit" className="bg-[#1A3C40] text-white p-4 rounded-[15px] font-bold text-base mt-2 hover:opacity-90 w-full transition-transform hover:-translate-y-px shadow-xl shadow-[#1A3C40]/20 cursor-pointer">Login</button>
                    </form>

                    <div className="flex items-center my-8 text-black text-sm font-bold">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button className="w-full p-3.5 border border-gray-200 rounded-[15px] bg-white text-[#1F2040] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            {/* Google Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                        <button className="w-full p-3.5 border border-gray-200 rounded-[15px] bg-white text-[#1F2040] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            {/* GitHub Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        Don't have an account? <Link to="/signup" className="text-[#4A5AE8] font-bold ml-1 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
