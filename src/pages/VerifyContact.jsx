import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../contexts/ToastContext'

const VerifyContact = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    
    const [contact, setContact] = useState(location.state?.contact || '')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [canResend, setCanResend] = useState(true)
    const [retryAfter, setRetryAfter] = useState(0)

    useEffect(() => {
        // Countdown timer for resend
        if (retryAfter > 0) {
            const timer = setTimeout(() => {
                setRetryAfter(retryAfter - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (retryAfter === 0) {
            setCanResend(true)
        }
    }, [retryAfter])

    const handleVerify = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        if (!contact) {
            setFieldErrors({ contact: 'Contact is required' })
            toast.error('Please enter your contact')
            setLoading(false)
            return
        }

        if (!token) {
            setFieldErrors({ token: 'Verification code is required' })
            toast.error('Please enter the verification code')
            setLoading(false)
            return
        }

        try {
            await axios.post(`${API_BASE}/contact-verification`, {
                contact,
                token
            })

            toast.success('Contact verified successfully! Redirecting to login...')
            setTimeout(() => {
                navigate('/login', { state: { contact } })
            }, 1500)
        } catch (error) {
            console.error('Verification error:', error)

            if (error.response?.status === 422 && (error.response?.data?.errors || error.response?.data?.messages)) {
                const errors = error.response.data.errors || error.response.data.messages
                const formattedErrors = {}
                
                Object.keys(errors).forEach(key => {
                    formattedErrors[key] = errors[key][0]
                })
                
                setFieldErrors(formattedErrors)
                toast.error('Please fix the errors in the form')
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Verification failed. Please try again.')
            }
        }

        setLoading(false)
    }

    const handleResend = async () => {
        if (!contact) {
            toast.error('Please enter your contact')
            return
        }

        if (!canResend) {
            toast.warning(`Please wait ${retryAfter} seconds before requesting again`)
            return
        }

        setResendLoading(true)
        setCanResend(false)

        try {
            const response = await axios.post(`${API_BASE}/contact-verification/resend`, {
                contact
            })

            toast.success('Verification code resent successfully!')
            
            // Set retry timer if provided
            if (response.data?.data?.retry_after_seconds) {
                setRetryAfter(response.data.data.retry_after_seconds)
            } else {
                // Default 60 seconds cooldown
                setRetryAfter(60)
            }
        } catch (error) {
            console.error('Resend error:', error)

            if (error.response?.status === 429) {
                const retrySeconds = error.response.data?.data?.retry_after_seconds || 60
                setRetryAfter(retrySeconds)
                toast.error(`Too many requests. Please wait ${Math.ceil(retrySeconds / 60)} minutes.`)
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
                setCanResend(true)
            } else {
                toast.error('Failed to resend code. Please try again.')
                setCanResend(true)
            }
        }

        setResendLoading(false)
    }

    const handleContactChange = (e) => {
        setContact(e.target.value)
        if (fieldErrors.contact) {
            setFieldErrors({ ...fieldErrors, contact: null })
        }
    }

    const handleTokenChange = (e) => {
        setToken(e.target.value)
        if (fieldErrors.token) {
            setFieldErrors({ ...fieldErrors, token: null })
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-[#1A3C40] text-sm font-bold no-underline hover:underline"
                >
                    Go back
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-[#1A3C40] mb-2">Verify Your Contact</h1>
                    <p className="text-gray-600 mb-8">
                        Enter the verification code sent to your email or phone
                    </p>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Phone Number
                            </label>
                            <input
                                type="text"
                                id="contact"
                                value={contact}
                                onChange={handleContactChange}
                                className={`w-full px-4 py-3 border ${
                                    fieldErrors.contact ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                placeholder="Enter your email or phone"
                                disabled={loading}
                            />
                            {fieldErrors.contact && (
                                <p className="mt-1 text-sm text-red-500">{fieldErrors.contact}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                id="token"
                                value={token}
                                onChange={handleTokenChange}
                                className={`w-full px-4 py-3 border ${
                                    fieldErrors.token ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                disabled={loading}
                            />
                            {fieldErrors.token && (
                                <p className="mt-1 text-sm text-red-500">{fieldErrors.token}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#00B8D4] text-white py-3 rounded-lg font-semibold transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00A3C4]'
                            }`}
                        >
                            {loading ? 'Verifying...' : 'Verify Contact'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={!canResend || resendLoading}
                                className={`text-[#00B8D4] font-medium ${
                                    !canResend || resendLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:underline'
                                }`}
                            >
                                {resendLoading
                                    ? 'Sending...'
                                    : !canResend
                                    ? `Resend code (${retryAfter}s)`
                                    : 'Resend verification code'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already verified?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#00B8D4] font-medium hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyContact
