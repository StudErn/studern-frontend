import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 p-8 font-sans">
            <div className="mb-4">
                <Link to="/" className="text-primary text-sm font-medium no-underline hover:underline">Go to Home</Link>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-center gap-16 flex-col md:flex-row">
                <div className="hidden md:flex flex-1 justify-center items-center h-[500px] bg-gradient-to-br from-cyan-50 to-indigo-50 rounded-3xl relative overflow-hidden">
                    {/* Placeholder for illustration seen in design */}
                    <div className="relative w-full h-full">
                        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-60"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-[70%] bg-white rounded-t-3xl shadow-2xl border-4 border-gray-100 border-b-0">
                            <div className="w-full h-full bg-white rounded-t-[18px]"></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-[450px] p-8">
                    <div className="text-center text-4xl font-bold mb-8 flex items-center justify-center gap-1">
                        <span className="text-primary">Stud</span>
                        <span className="text-secondary">Ern</span>
                        <span className="text-3xl ml-2 -rotate-12">🎓</span>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div className="w-full">
                            <input type="text" placeholder="Email or Username" className="w-full p-4 px-5 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="w-full">
                            <input type="password" placeholder="Password" className="w-full p-4 px-5 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-primary text-sm font-semibold no-underline hover:underline">Forget password?</a>
                        </div>

                        <button type="submit" className="bg-[#1A3C40] text-white p-4 rounded-full font-semibold text-base mt-2 hover:opacity-90 w-full transition-transform hover:-translate-y-px shadow-lg shadow-teal-900/10">Login</button>
                    </form>

                    <div className="flex items-center my-6 text-gray-400 text-sm font-medium">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-4">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="w-full p-3 border border-gray-200 rounded-full bg-white text-gray-800 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <span className="text-red-500 font-bold">G</span> Continue with Google
                        </button>
                        <button className="w-full p-3 border border-gray-200 rounded-full bg-white text-gray-800 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-800 font-bold">GH</span> Continue with GitHub
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-[#4A5AE8] font-semibold ml-1 hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
