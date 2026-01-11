import React from 'react'
import { Link } from 'react-router-dom'
import signupImage from '../assets/signupimages.png'

const Signup = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <Link to="/" className="text-[#1A3C40] text-sm font-bold no-underline hover:underline">Go to Home</Link>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-between gap-8 lg:gap-16 flex-col md:flex-row">

                {/* Left Side Form */}
                <div className="flex-1 max-w-[500px] w-full p-4">
                    <h1 className="text-[#1A3C40] text-3xl md:text-4xl font-bold mb-8">Create an account</h1>

                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Name</label>
                            <input type="text" placeholder="Shopnil" className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Email</label>
                            <input type="email" placeholder="shopnilsaha39@gmail.com" className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">NID number</label>
                            <input type="text" placeholder="*************" className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Password</label>
                            <input type="password" placeholder="must be 8 character 12#8**=+" className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Re-type password</label>
                            <input type="password" placeholder="must be 8 character 12#8**=+" className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm" />
                        </div>

                        <div className="mt-6">
                            <button type="submit" className="bg-[#1F2040] text-white px-12 py-3 rounded-[10px] font-bold text-base hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#1F2040]/20">Register</button>
                        </div>
                    </form>

                    <div className="mt-12 text-center md:text-left">
                        <p className="text-sm text-[#1F2040] font-medium">
                            Already have an account? <Link to="/login" className="text-[#1F2040] font-bold no-underline ml-1">Login</Link>
                        </p>
                    </div>
                </div>

                {/* Right Side Illustration */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <img src={signupImage} alt="Signup Illustration" className="w-full max-w-[600px] object-contain" />
                </div>

            </div>
        </div>
    )
}

export default Signup
