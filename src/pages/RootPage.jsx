import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'

const RootPage = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return isAuthenticated ? <Dashboard /> : <Home />
}

export default RootPage
