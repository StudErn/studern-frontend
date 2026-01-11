import React from 'react'
import Navbar from '../components/Navbar'

const JobFairPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Intern Job Fair</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Join the largest intern job fair in Dhaka.
                    100+ Companies hiring for thousands of positions.
                </p>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4">Registration Details</h2>
                    <p className="text-gray-600">Registration form coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default JobFairPage
