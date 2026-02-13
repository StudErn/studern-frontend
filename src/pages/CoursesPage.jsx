import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CoursesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Online Courses with Guaranteed Placement</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Explore our premium courses designed to get you job-ready.
                    From Full Stack Development to Data Science, we've got you covered.
                </p>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4">Course Catalog</h2>
                    <p className="text-gray-600">Listing coming soon...</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CoursesPage
