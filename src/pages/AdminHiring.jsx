import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const AdminHiring = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [hiring, setHiring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [selectedHiring, setSelectedHiring] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        job_title: '',
        hiring_type: '',
        work_from: '',
        employment_type: '',
        num_of_openings: '',
        description: '',
        closing_at: '',
        // Job specific
        salary_min: '',
        salary_max: '',
        experience_required: '',
        skills_required: '',
        benefits: '',
        job_requirements: '',
        // Internship specific
        stipend: '',
        duration_months: '',
        is_paid: false,
        learning_outcomes: '',
        internship_requirements: ''
    });

    useEffect(() => {
        fetchHiring();
    }, [currentPage, searchTerm, typeFilter, statusFilter]);

    const fetchHiring = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                per_page: 15
            });

            if (searchTerm) params.append('search', searchTerm);
            if (typeFilter) params.append('hiring_type', typeFilter);
            if (statusFilter) params.append('status', statusFilter);

            const response = await axios.get(`/api/admin/hiring?${params}`);
            setHiring(response.data.data.hiring);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching hiring:', error);
            toast.error('Failed to load hiring details');
        } finally {
            setLoading(false);
        }
    };

    const handleEditHiring = (hiringItem) => {
        setSelectedHiring(hiringItem);
        setEditForm({
            job_title: hiringItem.job_title || '',
            hiring_type: hiringItem.hiring_type || '',
            work_from: hiringItem.work_from || '',
            employment_type: hiringItem.employment_type || '',
            num_of_openings: hiringItem.num_of_openings || '',
            description: hiringItem.description || '',
            closing_at: hiringItem.closing_at ? hiringItem.closing_at.split('T')[0] : '',
            // Job specific
            salary_min: hiringItem.details?.salary_min || '',
            salary_max: hiringItem.details?.salary_max || '',
            experience_required: hiringItem.details?.experience_required || '',
            skills_required: hiringItem.details?.skills_required || '',
            benefits: hiringItem.details?.benefits || '',
            job_requirements: hiringItem.details?.requirements || '',
            // Internship specific
            stipend: hiringItem.details?.stipend || '',
            duration_months: hiringItem.details?.duration_months || '',
            is_paid: hiringItem.details?.is_paid || false,
            learning_outcomes: hiringItem.details?.learning_outcomes || '',
            internship_requirements: hiringItem.details?.requirements || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateHiring = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                job_title: editForm.job_title,
                hiring_type: editForm.hiring_type,
                work_from: editForm.work_from,
                employment_type: editForm.employment_type,
                num_of_openings: parseInt(editForm.num_of_openings),
                description: editForm.description,
                closing_at: editForm.closing_at
            };

            if (editForm.hiring_type === 'job') {
                updateData.salary_min = editForm.salary_min ? parseFloat(editForm.salary_min) : null;
                updateData.salary_max = editForm.salary_max ? parseFloat(editForm.salary_max) : null;
                updateData.experience_required = editForm.experience_required;
                updateData.skills_required = editForm.skills_required;
                updateData.benefits = editForm.benefits;
                updateData.job_requirements = editForm.job_requirements;
            } else if (editForm.hiring_type === 'internship') {
                updateData.stipend = editForm.stipend ? parseFloat(editForm.stipend) : null;
                updateData.duration_months = parseInt(editForm.duration_months);
                updateData.is_paid = editForm.is_paid;
                updateData.learning_outcomes = editForm.learning_outcomes;
                updateData.internship_requirements = editForm.internship_requirements;
            }

            await axios.put(`/api/admin/hiring/${selectedHiring.id}`, updateData);
            toast.success('Hiring details updated successfully');
            setShowEditModal(false);
            fetchHiring();
        } catch (error) {
            console.error('Error updating hiring:', error);
            toast.error(error.response?.data?.message || 'Failed to update hiring details');
        }
    };

    const handleDeleteHiring = async (hiringId) => {
        if (!window.confirm('Are you sure you want to delete this hiring post? This action cannot be undone.')) return;

        try {
            await axios.delete(`/api/admin/hiring/${hiringId}`);
            toast.success('Hiring details deleted successfully');
            fetchHiring();
        } catch (error) {
            console.error('Error deleting hiring:', error);
            toast.error(error.response?.data?.message || 'Failed to delete hiring details');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'job': return 'bg-blue-100 text-blue-800';
            case 'internship': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    if (loading && hiring.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hiring details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Hiring Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage job and internship postings</p>
                    </div>

                    {/* Filters */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search hiring posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="job">Jobs</option>
                                    <option value="internship">Internships</option>
                                </select>
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Hiring Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Posted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Closing
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {hiring.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.job_title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.num_of_openings} openings • {item.work_from} • {item.employment_type}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.company.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                by {item.posted_by.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.hiring_type)}`}>
                                                {item.hiring_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.is_active)}`}>
                                                {item.is_active ? 'Active' : 'Closed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.posted_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.closing_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditHiring(item)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteHiring(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                                {pagination.total} results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={pagination.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Hiring Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Hiring Details</h3>
                            <form onSubmit={handleUpdateHiring} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        value={editForm.job_title}
                                        onChange={(e) => setEditForm({...editForm, job_title: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hiring Type</label>
                                    <select
                                        value={editForm.hiring_type}
                                        onChange={(e) => setEditForm({...editForm, hiring_type: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="job">Job</option>
                                        <option value="internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Work From</label>
                                    <select
                                        value={editForm.work_from}
                                        onChange={(e) => setEditForm({...editForm, work_from: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Work Type</option>
                                        <option value="office">Office</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                                    <select
                                        value={editForm.employment_type}
                                        onChange={(e) => setEditForm({...editForm, employment_type: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Employment Type</option>
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Number of Openings</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.num_of_openings}
                                        onChange={(e) => setEditForm({...editForm, num_of_openings: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                                    <input
                                        type="date"
                                        value={editForm.closing_at}
                                        onChange={(e) => setEditForm({...editForm, closing_at: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Job Specific Fields */}
                                {editForm.hiring_type === 'job' && (
                                    <>
                                        <div className="border-t pt-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Job Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.salary_min}
                                                        onChange={(e) => setEditForm({...editForm, salary_min: e.target.value})}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.salary_max}
                                                        onChange={(e) => setEditForm({...editForm, salary_max: e.target.value})}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Experience Required</label>
                                                <input
                                                    type="text"
                                                    value={editForm.experience_required}
                                                    onChange={(e) => setEditForm({...editForm, experience_required: e.target.value})}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Skills Required</label>
                                                <textarea
                                                    value={editForm.skills_required}
                                                    onChange={(e) => setEditForm({...editForm, skills_required: e.target.value})}
                                                    rows={2}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Benefits</label>
                                                <textarea
                                                    value={editForm.benefits}
                                                    onChange={(e) => setEditForm({...editForm, benefits: e.target.value})}
                                                    rows={2}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Internship Specific Fields */}
                                {editForm.hiring_type === 'internship' && (
                                    <>
                                        <div className="border-t pt-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-3">Internship Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Stipend</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.stipend}
                                                        onChange={(e) => setEditForm({...editForm, stipend: e.target.value})}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Duration (Months)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="24"
                                                        value={editForm.duration_months}
                                                        onChange={(e) => setEditForm({...editForm, duration_months: e.target.value})}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.is_paid}
                                                        onChange={(e) => setEditForm({...editForm, is_paid: e.target.checked})}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-gray-700">Paid Internship</span>
                                                </label>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Learning Outcomes</label>
                                                <textarea
                                                    value={editForm.learning_outcomes}
                                                    onChange={(e) => setEditForm({...editForm, learning_outcomes: e.target.value})}
                                                    rows={2}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                    >
                                        Update Hiring
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHiring;