import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getSafeReturnUrl } from '../utils/safeRedirect'
import loginImage from '../assets/loginimages.png'
import studernLogo from '../assets/StudErn Logo.png'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const toast = useToast()
    const [showPassword, setShowPassword] = useState(false)

    // Backend base URL (same as what AuthContext uses)
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    // Validated post-login destination — safe against open-redirect attacks
    const returnTo = getSafeReturnUrl(searchParams.get('returnTo'))

    /** Kick off the Google OAuth flow by navigating to the backend redirect URL */
    const handleGoogleLogin = async () => {
        try {
            const response = await axios.get(`${API_BASE}/auth/google/redirect`)
            const { url } = response.data.data
            window.location.href = url
        } catch (error) {
            console.error('Google OAuth initiation failed:', error)
            toast.error('Could not connect to Google. Please try again.')
        }
    }

    /** Kick off the LinkedIn OAuth flow by navigating to the backend redirect URL */
    const handleLinkedInLogin = async () => {
        try {
            const response = await axios.get(`${API_BASE}/auth/linkedin/redirect`)
            const { url } = response.data.data
            window.location.href = url
        } catch (error) {
            console.error('LinkedIn OAuth initiation failed:', error)
            toast.error('Could not connect to LinkedIn. Please try again.')
        }
    }

    /** Kick off the GitHub OAuth flow by navigating to the backend redirect URL */
    const handleGitHubLogin = async () => {
        try {
            const response = await axios.get(`${API_BASE}/auth/github/redirect`)
            const { url } = response.data.data
            window.location.href = url
        } catch (error) {
            console.error('GitHub OAuth initiation failed:', error)
            toast.error('Could not connect to GitHub. Please try again.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        const result = await login(identifier, password)

        if (result.success) {
            toast.success('Login successful! Redirecting...')
            setTimeout(() => {
                navigate(returnTo, { replace: true })
            }, 1000)
        } else {
            toast.error(result.message || 'Login failed')
            if (result.errors) {
                setFieldErrors(result.errors)
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button onClick={() => navigate('/')} className="text-[#1A3C40] text-sm font-bold no-underline hover:underline">Go back</button>
            </div>

            <div className="flex flex-1 max-w-[1200px] mx-auto w-full items-center justify-center gap-8 lg:gap-20 flex-col md:flex-row">
                {/* Left Side Illustration */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <img src={loginImage} alt="Login Illustration" className="w-full max-w-[500px] object-contain" />
                </div>

                {/* Right Side Form */}
                <div className="flex-1 w-full max-w-[450px] p-4 md:p-8">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <img src={studernLogo} alt="StudErn Logo" className="h-16 w-auto object-contain mx-auto" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Email or Phone"
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value)
                                    if (fieldErrors.identifier) {
                                        setFieldErrors({ ...fieldErrors, identifier: '' })
                                    }
                                }}
                                className={`w-full p-4 px-5 border rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-1 outline-none placeholder-gray-400 transition-all font-medium ${
                                    fieldErrors.identifier 
                                        ? 'bg-red-50 border-red-500 focus:ring-red-500' 
                                        : 'bg-gray-50 border-gray-100 focus:ring-[#00B8D4]'
                                }`}
                                required
                            />
                            {fieldErrors.identifier && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.identifier}</p>
                            )}
                        </div>

                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (fieldErrors.password) {
                                        setFieldErrors({ ...fieldErrors, password: '' })
                                    }
                                }}
                                className={`w-full p-4 px-5 pr-12 border rounded-xl text-sm text-gray-800 focus:bg-white focus:ring-1 outline-none placeholder-gray-400 transition-all font-medium ${
                                    fieldErrors.password
                                        ? 'bg-red-50 border-red-500 focus:ring-red-500'
                                        : 'bg-gray-50 border-gray-100 focus:ring-[#00B8D4]'
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {fieldErrors.password && (
                                <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-[#1F2040] text-sm font-bold no-underline hover:underline opacity-80"
                            >
                                Forget password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1A3C40] text-white p-4 rounded-[15px] font-bold text-base mt-2 hover:opacity-90 w-full transition-transform hover:-translate-y-px shadow-xl shadow-[#1A3C40]/20 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="flex items-center my-8 text-black text-sm font-bold">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full p-3.5 border border-gray-200 rounded-[15px] bg-white text-[#1F2040] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            {/* Google Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            onClick={handleLinkedInLogin}
                            className="w-full p-3.5 border border-gray-200 rounded-[15px] bg-white text-[#1F2040] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            {/* LinkedIn Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Continue with LinkedIn
                        </button>
                        <button
                            type="button"
                            onClick={handleGitHubLogin}
                            className="w-full p-3.5 border border-gray-200 rounded-[15px] bg-white text-[#1F2040] font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                            {/* GitHub Icon SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#24292e" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        Don't have an account? <Link to="/signup" className="text-[#4A5AE8] font-bold ml-1 hover:underline">Sign up</Link>
                    </p>

                    <p className="text-center mt-3 text-sm text-gray-500 font-medium">
                        Need to verify your contact? <button onClick={() => navigate('/verify-contact')} className="text-[#00B8D4] font-bold ml-1 hover:underline">Verify here</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
