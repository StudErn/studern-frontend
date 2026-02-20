import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import studernLogo from '../assets/StudErn Logo.png'

/**
 * GoogleAuthCallback
 *
 * This page is the SPA-side landing point after a Google OAuth flow.
 * The backend redirects here with either:
 *   ?token=<jwt>            — success
 *   ?error=<code>&message=  — failure
 *
 * It calls loginWithToken() from AuthContext, which hits /api/auth/me
 * to hydrate the user object, then navigates to the dashboard.
 */
const GoogleAuthCallback = () => {
    const [searchParams] = useSearchParams()
    const { loginWithToken } = useAuth()
    const navigate = useNavigate()
    const toast = useToast()
    const [statusMsg, setStatusMsg] = useState('Completing Google sign-in…')

    useEffect(() => {
        const token   = searchParams.get('token')
        const error   = searchParams.get('error')
        const message = searchParams.get('message')

        if (error) {
            toast.error(message || 'Google sign-in failed. Please try again.')
            navigate('/login', { replace: true })
            return
        }

        if (!token) {
            toast.error('No authentication token received from Google.')
            navigate('/login', { replace: true })
            return
        }

        setStatusMsg('Signing you in…')

        loginWithToken(token).then((result) => {
            if (result.success) {
                toast.success('Signed in with Google!')
                navigate('/dashboard', { replace: true })
            } else {
                toast.error(result.message || 'Failed to complete Google sign-in.')
                navigate('/login', { replace: true })
            }
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 p-8">
            {/* Logo */}
            <img
                src={studernLogo}
                alt="StudErn Logo"
                className="h-16 w-auto object-contain"
            />

            {/* Spinner */}
            <div className="w-10 h-10 border-4 border-[#1A3C40] border-t-transparent rounded-full animate-spin" />

            {/* Status text */}
            <p className="text-gray-600 font-medium text-sm">{statusMsg}</p>
        </div>
    )
}

export default GoogleAuthCallback
