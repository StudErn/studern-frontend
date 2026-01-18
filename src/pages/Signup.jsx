import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import signupImage from '../assets/signupimages.png'

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        username: '',
        contact: '',
        date_of_birth: '',
        password: '',
        confirm_password: '',
        gender: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const devicePayload = {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                screen: `${window.screen.width}x${window.screen.height}`,
                platform: navigator.platform,
                ua: navigator.userAgent,
            }

            const response = await axios.post('http://localhost:8000/api/register', {
                ...formData,
                devicePayload
            })

            // Assuming registration is successful, redirect to login or auto-login
            navigate('/login')
        } catch (error) {
            console.error('Signup error:', error)
            setError(error.response?.data?.message || 'Registration failed')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button onClick={() => navigate(-1)} className="text-[#1A3C40] text-sm font-bold no-underline hover:underline">Go back</button>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-between gap-8 lg:gap-16 flex-col md:flex-row">

                {/* Left Side Form */}
                <div className="flex-1 max-w-[500px] w-full p-4">
                    <h1 className="text-[#1A3C40] text-3xl md:text-4xl font-bold mb-8">Create an account</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Middle Name</label>
                            <input
                                type="text"
                                name="middlename"
                                value={formData.middlename}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Email or Phone</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="email@example.com or +1234567890"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none shadow-sm"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 8 characters"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Confirm Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Re-type password"
                                className="w-full p-3.5 px-4 bg-white border border-gray-100 rounded-[10px] text-sm text-gray-800 focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4] outline-none placeholder-gray-300 shadow-sm"
                                required
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#1F2040] text-white px-12 py-3 rounded-[10px] font-bold text-base hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#1F2040]/20 disabled:opacity-50"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
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
