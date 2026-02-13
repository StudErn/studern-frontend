import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import signupImage from '../assets/signupimages.png'
import { useToast } from '../contexts/ToastContext'
import { Eye, EyeOff } from 'lucide-react'

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
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: ''
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        if (formData.password !== formData.confirm_password) {
            setFieldErrors({ confirm_password: 'Passwords do not match' })
            toast.error('Passwords do not match')
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

            await axios.post(`${API_BASE}/register`, {
                ...formData,
                devicePayload
            })

            toast.success('Registration successful! Please verify your contact.')
            setTimeout(() => {
                navigate('/verify-contact', { state: { contact: formData.contact } })
            }, 1500)
        } catch (error) {
            console.error('Signup error:', error)
            
            // Handle validation errors from Laravel
            if (error.response?.status === 422 && (error.response?.data?.errors || error.response?.data?.messages)) {
                const errors = error.response.data.errors || error.response.data.messages
                const formattedErrors = {}
                
                // Map Laravel validation errors to form fields
                Object.keys(errors).forEach(key => {
                    formattedErrors[key] = errors[key][0] // Get first error message
                })
                
                setFieldErrors(formattedErrors)
                toast.error('Please fix the errors in the form')
            } else if (error.response?.data?.message) {
                // Handle general error message
                toast.error(error.response.data.message)
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error('Registration failed. Please try again.')
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')} className="text-[#1A3C40] text-sm font-bold no-underline hover:underline">Go back</button>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-between gap-8 lg:gap-16 flex-col md:flex-row">

                {/* Left Side Form */}
                <div className="flex-1 max-w-[500px] w-full p-4">
                    <h1 className="text-[#1A3C40] text-3xl md:text-4xl font-bold mb-8">Create an account</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="John"
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                    fieldErrors.firstname 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.firstname && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.firstname}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Middle Name</label>
                            <input
                                type="text"
                                name="middlename"
                                value={formData.middlename}
                                onChange={handleChange}
                                placeholder="Optional"
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                    fieldErrors.middlename 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                            />
                            {fieldErrors.middlename && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.middlename}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Doe"
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                    fieldErrors.lastname 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.lastname && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.lastname}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                    fieldErrors.username 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.username && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.username}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Email or Phone</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="email@example.com or +1234567890"
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                    fieldErrors.contact 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.contact && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.contact}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none shadow-sm ${
                                    fieldErrors.date_of_birth 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.date_of_birth && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.date_of_birth}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`w-full p-3.5 px-4 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none shadow-sm ${
                                    fieldErrors.gender 
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                        : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                }`}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {fieldErrors.gender && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.gender}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
                                    className={`w-full p-3.5 px-4 pr-12 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                        fieldErrors.password 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-sm text-[#1F2040]">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Re-type password"
                                    className={`w-full p-3.5 px-4 pr-12 bg-white border rounded-[10px] text-sm text-gray-800 focus:ring-1 outline-none placeholder-gray-300 shadow-sm ${
                                        fieldErrors.confirm_password 
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-100 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {fieldErrors.confirm_password && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.confirm_password}</p>
                            )}
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
