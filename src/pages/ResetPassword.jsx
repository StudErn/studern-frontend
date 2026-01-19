import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../contexts/ToastContext'

const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    
    const [contact, setContact] = useState(location.state?.contact || '')
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [resetBearerToken, setResetBearerToken] = useState(null)
    const [tokenVerified, setTokenVerified] = useState(false)

    const handleVerifyToken = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setVerifyLoading(true)

        if (!contact) {
            setFieldErrors({ contact: 'Contact is required' })
            toast.error('Please enter your contact')
            setVerifyLoading(false)
            return
        }

        if (!token) {
            setFieldErrors({ token: 'Reset code is required' })
            toast.error('Please enter the reset code')
            setVerifyLoading(false)
            return
        }

        try {
            const response = await axios.post(`${API_BASE}/reset-password/verify`, {
                contact,
                token
            })

            const bearerToken = response.data.data.reset_bearer_token
            const expiresIn = response.data.data.expires_in_minutes

            setResetBearerToken(bearerToken)
            setTokenVerified(true)
            toast.success(`Code verified! Please set your new password. (Expires in ${expiresIn} minutes)`)
        } catch (error) {
            console.error('Token verification error:', error)

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
                toast.error('Invalid or expired reset code')
            }
        }

        setVerifyLoading(false)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setFieldErrors({})
        setLoading(true)

        if (!newPassword) {
            setFieldErrors({ new_password: 'New password is required' })
            toast.error('Please enter a new password')
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setFieldErrors({ confirm_password: 'Passwords do not match' })
            toast.error('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            await axios.post(`${API_BASE}/reset-password/reset`, {
                reset_bearer_token: resetBearerToken,
                new_password: newPassword,
                confirm_password: confirmPassword
            })

            toast.success('Password reset successfully! Redirecting to login...')
            setTimeout(() => {
                navigate('/login', { state: { contact } })
            }, 1500)
        } catch (error) {
            console.error('Password reset error:', error)

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
                toast.error('Failed to reset password. Please try again.')
            }
        }

        setLoading(false)
    }

    const handleFieldChange = (field, value) => {
        switch (field) {
            case 'contact':
                setContact(value)
                break
            case 'token':
                setToken(value)
                break
            case 'new_password':
                setNewPassword(value)
                break
            case 'confirm_password':
                setConfirmPassword(value)
                break
        }
        
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: null })
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white p-4 md:p-8 font-sans">
            <div className="mb-4">
                <button 
                    onClick={() => navigate('/forgot-password')} 
                    className="text-[#1A3C40] text-sm font-bold no-underline hover:underline"
                >
                    Back
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-[#1A3C40] mb-2">Reset Password</h1>
                    <p className="text-gray-600 mb-8">
                        {tokenVerified
                            ? 'Enter your new password'
                            : 'Enter the reset code sent to your email or phone'}
                    </p>

                    {!tokenVerified ? (
                        <form onSubmit={handleVerifyToken} className="space-y-6">
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email or Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="contact"
                                    value={contact}
                                    onChange={(e) => handleFieldChange('contact', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        fieldErrors.contact ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                    placeholder="Enter your email or phone"
                                    disabled={verifyLoading}
                                />
                                {fieldErrors.contact && (
                                    <p className="mt-1 text-sm text-red-500">{fieldErrors.contact}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                                    Reset Code
                                </label>
                                <input
                                    type="text"
                                    id="token"
                                    value={token}
                                    onChange={(e) => handleFieldChange('token', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        fieldErrors.token ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    disabled={verifyLoading}
                                />
                                {fieldErrors.token && (
                                    <p className="mt-1 text-sm text-red-500">{fieldErrors.token}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={verifyLoading}
                                className={`w-full bg-[#00B8D4] text-white py-3 rounded-lg font-semibold transition-colors ${
                                    verifyLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00A3C4]'
                                }`}
                            >
                                {verifyLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new_password"
                                    value={newPassword}
                                    onChange={(e) => handleFieldChange('new_password', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        fieldErrors.new_password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                    placeholder="Enter new password"
                                    disabled={loading}
                                />
                                {fieldErrors.new_password && (
                                    <p className="mt-1 text-sm text-red-500">{fieldErrors.new_password}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Must include uppercase, lowercase, number, and special character
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    value={confirmPassword}
                                    onChange={(e) => handleFieldChange('confirm_password', e.target.value)}
                                    className={`w-full px-4 py-3 border ${
                                        fieldErrors.confirm_password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]`}
                                    placeholder="Confirm new password"
                                    disabled={loading}
                                />
                                {fieldErrors.confirm_password && (
                                    <p className="mt-1 text-sm text-red-500">{fieldErrors.confirm_password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#00B8D4] text-white py-3 rounded-lg font-semibold transition-colors ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00A3C4]'
                                }`}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
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

export default ResetPassword
