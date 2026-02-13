import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const Profile = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editForm, setEditForm] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        username: '',
        date_of_birth: '',
        gender: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/profile');
            const profileData = response.data.data || response.data;
            
            // Handle different response structures
            const userData = profileData.user || profileData;
            
            setProfile(userData);
            setEditForm({
                firstname: userData.firstname || '',
                middlename: userData.middlename || '',
                lastname: userData.lastname || '',
                username: userData.username || '',
                date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth).toISOString().split('T')[0] : '',
                gender: userData.gender || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/profile', editForm);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/profile/change-password', passwordForm);
            toast.success('Password changed successfully');
            setShowPasswordModal(false);
            setPasswordForm({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="mt-1 text-sm text-gray-600">Manage your personal information</p>
                        </div>
                        <div className="flex space-x-3">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-6 py-6">
                        {!isEditing ? (
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {profile?.firstname} {profile?.middlename} {profile?.lastname}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Username</dt>
                                            <dd className="mt-1 text-sm text-gray-900">@{profile?.username}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                            <dd className="mt-1 text-sm text-gray-900 capitalize">{profile?.gender || 'Not set'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contact</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {profile?.contact?.contact || 'Not set'}
                                                {profile?.contact?.verified && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        Verified
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(profile?.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Privileges */}
                                {profile?.privileges && profile.privileges.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Privileges</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.privileges.map((privilege, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {privilege}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Companies */}
                                {profile?.companies && profile.companies.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Companies</h2>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {profile.companies.map((company) => (
                                                <div key={company.id} className="border rounded-lg p-4">
                                                    <div className="flex items-center space-x-3">
                                                        {company.logo && (
                                                            <img src={company.logo} alt={company.name} className="h-10 w-10 rounded" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{company.name}</p>
                                                            <p className="text-xs text-gray-500">{company.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            value={editForm.firstname}
                                            onChange={(e) => setEditForm({...editForm, firstname: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                        <input
                                            type="text"
                                            value={editForm.middlename}
                                            onChange={(e) => setEditForm({...editForm, middlename: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={editForm.lastname}
                                            onChange={(e) => setEditForm({...editForm, lastname: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={editForm.date_of_birth}
                                            onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                                        <select
                                            value={editForm.gender}
                                            onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.current_password}
                                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.new_password}
                                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.new_password_confirmation}
                                        onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                    >
                                        Change Password
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

export default Profile;