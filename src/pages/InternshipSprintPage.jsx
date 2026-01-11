import React from 'react'
import Navbar from '../components/Navbar'

const InternshipSprintPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Mega Internship Sprint</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Apply to premium internships with guaranteed stipends.
                    Perfect for freshers looking to kickstart their career.
                </p>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4">Active Sprints</h2>
                    <p className="text-gray-600">Application forms loading...</p>
                </div>
            </div>
        </div>
    )
}

export default InternshipSprintPage
