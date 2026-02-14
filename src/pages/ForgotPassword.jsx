import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../contexts/ToastContext'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    
    const [contact, setContact] = useState('')
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [requestSent, setRequestSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        if (!contact) {
            setFieldErrors({ contact: 'Contact is required' })
            toast.error('Please enter your email or phone number')
            setLoading(false)
            return
        }

        try {
            await axios.post(`${API_BASE}/reset-password/request`, {
                contact
            })

            setRequestSent(true)
            toast.success('Password reset code sent successfully!')
            
            // Navigate to reset password page with contact
            setTimeout(() => {
                navigate('/reset-password', { state: { contact } })
            }, 1500)
        } catch (error) {
            console.error('Password reset request error:', error)

            if (error.response?.status === 422 && (error.response?.data?.errors || error.response?.data?.messages)) {
                const errors = error.response.data.errors || error.response.data.messages
                const formattedErrors = {}
                
                Object.keys(errors).forEach(key => {
                    formattedErrors[key] = errors[key][0]
                })
                
                setFieldErrors(formattedErrors)
                toast.error('Please fix the errors in the form')
            } else if (error.response?.status === 429) {
                const retryMinutes = Math.ceil((error.response.data?.data?.retry_after || 1800) / 60)
                toast.error(`Too many requests. Please try again after ${retryMinutes} minutes.`)
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Failed to send reset code. Please try again.')
            }
        }

        setLoading(false)
    }

    const handleContactChange = (e) => {
        setContact(e.target.value)
        if (fieldErrors.contact) {
            setFieldErrors({ ...fieldErrors, contact: null })
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button 
                    onClick={() => navigate('/login')} 
                    className="text-[#1A3C40] text-sm font-bold no-underline hover:underline"
                >
                    Back to Login
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-[#1A3C40] mb-2">Forgot Password?</h1>
                    <p className="text-gray-600 mb-8">
                        {requestSent
                            ? 'Check your email or phone for the reset code'
                            : 'Enter your email or phone number to receive a password reset code'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                disabled={loading || requestSent}
                            />
                            {fieldErrors.contact && (
                                <p className="mt-1 text-sm text-red-500">{fieldErrors.contact}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || requestSent}
                            className={`w-full bg-[#00B8D4] text-white py-3 rounded-lg font-semibold transition-colors ${
                                loading || requestSent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00A3C4]'
                            }`}
                        >
                            {loading ? 'Sending...' : requestSent ? 'Code Sent' : 'Send Reset Code'}
                        </button>
                    </form>

                    {requestSent && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                A password reset code has been sent to your contact. 
                                You will be redirected shortly...
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
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

export default ForgotPassword
