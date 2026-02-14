import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SavedJobs = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        fetchSavedJobs();
    }, [searchTerm, typeFilter]);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (typeFilter) params.append('hiring_type', typeFilter);

            const response = await axios.get(`/saved-jobs?${params}`);
            setSavedJobs(response.data.data.saved_jobs);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            toast.error('Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this job from saved list?')) return;
        try {
            await axios.delete(`/saved-jobs/${id}`);
            toast.success('Job removed from saved list');
            fetchSavedJobs();
        } catch (error) {
            toast.error('Failed to remove job');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
                        <p className="mt-1 text-sm text-gray-600">Jobs you've saved for later</p>
                    </div>

                    {/* Filters */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="job">Jobs</option>
                                <option value="internship">Internships</option>
                            </select>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="divide-y divide-gray-200">
                        {savedJobs.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No saved jobs</h3>
                                <p className="mt-1 text-sm text-gray-500">Start saving jobs to view them here</p>
                                <div className="mt-6">
                                    <Link
                                        to="/find-jobs"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Browse Jobs
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            savedJobs.map((saved) => (
                                <div key={saved.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="text-lg font-medium text-gray-900">{saved.hiring.job_title}</h3>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    saved.hiring.hiring_type === 'job' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {saved.hiring.hiring_type}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    saved.hiring.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {saved.hiring.is_active ? 'Active' : 'Closed'}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {saved.hiring.company.name}
                                                </span>
                                                <span>•</span>
                                                <span>{saved.hiring.work_from}</span>
                                                <span>•</span>
                                                <span>{saved.hiring.employment_type}</span>
                                            </div>
                                            {saved.notes && (
                                                <p className="mt-2 text-sm text-gray-600 italic">{saved.notes}</p>
                                            )}
                                            <p className="mt-2 text-xs text-gray-500">
                                                Saved {new Date(saved.saved_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex space-x-2">
                                            <Link
                                                to={`/jobs/${saved.hiring.id}`}
                                                className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleRemove(saved.id)}
                                                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedJobs;