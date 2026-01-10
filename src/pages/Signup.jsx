import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 p-8 font-sans">
            <div className="mb-4">
                <Link to="/" className="text-primary text-sm font-medium no-underline hover:underline">Go to Home</Link>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-center gap-16 flex-col md:flex-row">

                <div className="flex-1 max-w-[500px] p-4 md:p-8 w-full">
                    <h1 className="text-[#1A3C40] text-4xl font-bold mb-6">Create an account</h1>

                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-gray-800">Name</label>
                            <input type="text" placeholder="Shopnil" className="w-full p-3.5 px-4 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-gray-800">Email</label>
                            <input type="email" placeholder="shopnilsaha39@gmail.com" className="w-full p-3.5 px-4 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-gray-800">NID number</label>
                            <input type="text" placeholder="*************" className="w-full p-3.5 px-4 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-gray-800">Password</label>
                            <input type="password" placeholder="must be 8 character 12#8**=+" className="w-full p-3.5 px-4 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-gray-800">Re-type password</label>
                            <input type="password" placeholder="must be 8 character 12#8**=+" className="w-full p-3.5 px-4 bg-gray-50 border-none rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-2 focus:ring-secondary/20 outline-none placeholder-gray-400" />
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="bg-primary text-white px-10 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-opacity cursor-pointer">Register</button>
                        </div>
                    </form>

                    <p className="mt-8 text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-[#1A3C40] font-bold no-underline ml-1 hover:underline">Login</Link>
                    </p>
                </div>

                <div className="hidden md:flex flex-1 justify-center items-center h-[600px] bg-gradient-to-br from-cyan-50 to-white rounded-3xl">
                    <div className="relative w-4/5 h-4/5 flex items-center justify-center">
                        <div className="w-[250px] h-[500px] border-[8px] border-[#4F86F7] rounded-[30px] bg-blue-50 relative flex items-center justify-center shadow-2xl">
                            <div className="text-[5rem] text-[#4F86F7]">✓</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Signup
