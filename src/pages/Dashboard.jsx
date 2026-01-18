import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import Footer from '../components/Footer'

const Dashboard = () => {
    const { user } = useAuth()
    const [selectedRole, setSelectedRole] = useState('applicant')
    const [availableRoles, setAvailableRoles] = useState(['applicant'])

    useEffect(() => {
        // Determine available roles based on user privileges
        // This would typically come from an API call to get user privileges
        const roles = ['applicant']
        
        // Add recruiter role if user has company or recruiter privileges
        // TODO: Check actual privileges from backend
        roles.push('recruiter')
        
        // Add admin role if user has admin privileges
        // TODO: Check actual privileges from backend
        if (user?.username === 'admin') { // Placeholder logic
            roles.push('admin')
        }
        
        setAvailableRoles(roles)
    }, [user])

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value)
    }

    const renderApplicantView = () => (
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
    )

    const renderRecruiterView = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Active Jobs</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Currently open positions</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Applicants</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Total applicants</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Interviews</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Scheduled this week</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#1A3C40]">Posted Jobs</h3>
                    <button className="px-6 py-2.5 bg-[#1A3C40] text-white rounded-full font-bold text-sm hover:opacity-90">
                        Post New Job
                    </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <p>No jobs posted yet</p>
                </div>
            </div>
        </div>
    )

    const renderAdminView = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Registered users</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Companies</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Total companies</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Jobs</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Total job postings</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A3C40] mb-2">Applications</h3>
                    <p className="text-3xl font-bold text-[#00B8D4]">0</p>
                    <p className="text-sm text-gray-500 mt-2">Total applications</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#1A3C40] mb-4">System Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left">
                        <h4 className="font-bold text-[#1A3C40]">User Management</h4>
                        <p className="text-sm text-gray-500 mt-1">Manage user accounts and privileges</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left">
                        <h4 className="font-bold text-[#1A3C40]">Company Management</h4>
                        <p className="text-sm text-gray-500 mt-1">View and manage companies</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left">
                        <h4 className="font-bold text-[#1A3C40]">Job Management</h4>
                        <p className="text-sm text-gray-500 mt-1">Monitor and moderate job postings</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left">
                        <h4 className="font-bold text-[#1A3C40]">Reports & Analytics</h4>
                        <p className="text-sm text-gray-500 mt-1">View system statistics</p>
                    </button>
                </div>
            </div>
        </div>
    )

    const renderDashboardContent = () => {
        switch (selectedRole) {
            case 'recruiter':
                return renderRecruiterView()
            case 'admin':
                return renderAdminView()
            default:
                return renderApplicantView()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />
            
            <div className="flex flex-1">
                <DashboardSidebar 
                    selectedRole={selectedRole} 
                    onRoleChange={handleRoleChange}
                    availableRoles={availableRoles}
                />
                
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
                        {renderDashboardContent()}
                    </div>
                    
                    <Footer />
                </main>
            </div>
        </div>
    )
}

export default Dashboard
