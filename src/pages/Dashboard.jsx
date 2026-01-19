import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import Footer from '../components/Footer'

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />
            
            <div className="flex flex-1">
                <DashboardSidebar />
                
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-6 py-8">
                        {/* Welcome Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1A3C40]">
                                Welcome back, {user?.firstname}!
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Here's what's happening with your account today
                            </p>
                        </div>

                        {/* Dashboard Content */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Applications</h3>
                                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                                    <p className="text-sm text-gray-500 mt-2">Total applications submitted</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Interviews</h3>
                                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                                    <p className="text-sm text-gray-500 mt-2">Scheduled interviews</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Saved Jobs</h3>
                                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                                    <p className="text-sm text-gray-500 mt-2">Jobs you're interested in</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-[#1A3C40] mb-4">Recent Applications</h3>
                                <div className="text-center py-8 text-gray-500">
                                    <p>No applications yet</p>
                                    <button className="mt-4 px-6 py-2.5 bg-[#1A3C40] text-white rounded-full font-bold text-sm hover:opacity-90">
                                        Browse Jobs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Footer />
                </main>
            </div>
        </div>
    )
}

export default Dashboard
