import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import { Eye, EyeOff, Bell, Lock, Globe, User, Mail, Shield } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    application_updates: true,
    interview_reminders: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public',
    show_email: false,
    show_phone: false,
    allow_company_contact: true,
    show_resume: true,
  });

  // Security settings
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/settings');
      const settings = response.data.data || response.data;
      
      if (settings.account) {
        setAccountSettings(settings.account);
      }
      if (settings.privacy) {
        setPrivacySettings(settings.privacy);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Don't show error for first time users
      if (error.response?.status !== 404) {
        toast.error('Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveAccountSettings = async () => {
    try {
      setSaving(true);
      await axios.put('/settings/account', accountSettings);
      toast.success('Account settings saved successfully');
    } catch (error) {
      console.error('Error saving account settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    try {
      setSaving(true);
      await axios.put('/settings/privacy', privacySettings);
      toast.success('Privacy settings saved successfully');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

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
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your account preferences and security settings</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'account'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Security
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Name</p>
                          <p className="text-sm text-gray-900">{user?.firstname} {user?.lastname}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Username</p>
                          <p className="text-sm text-gray-900">@{user?.username}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Account Type</p>
                          <p className="text-sm text-gray-900 capitalize">{user?.role || 'User'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    <p className="text-sm text-gray-600 mb-6">Choose what notifications you want to receive</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.email_notifications}
                            onChange={(e) => setAccountSettings({...accountSettings, email_notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.sms_notifications}
                            onChange={(e) => setAccountSettings({...accountSettings, sms_notifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                          <p className="text-xs text-gray-500">Receive promotional and marketing emails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.marketing_emails}
                            onChange={(e) => setAccountSettings({...accountSettings, marketing_emails: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Application Updates</p>
                          <p className="text-xs text-gray-500">Get notified about your job applications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.application_updates}
                            onChange={(e) => setAccountSettings({...accountSettings, application_updates: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Interview Reminders</p>
                          <p className="text-xs text-gray-500">Receive reminders about upcoming interviews</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={accountSettings.interview_reminders}
                            onChange={(e) => setAccountSettings({...accountSettings, interview_reminders: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={saveAccountSettings}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Notification Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">Control how your information is shared</p>
                    
                    <div className="space-y-4">
                      <div className="py-3 border-b border-gray-200">
                        <label className="block text-sm font-medium text-gray-900 mb-2">Profile Visibility</label>
                        <select
                          value={privacySettings.profile_visibility}
                          onChange={(e) => setPrivacySettings({...privacySettings, profile_visibility: e.target.value})}
                          className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public - Visible to everyone</option>
                          <option value="companies">Companies Only - Only visible to registered companies</option>
                          <option value="private">Private - Only visible to you</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Show Email Address</p>
                          <p className="text-xs text-gray-500">Allow others to see your email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.show_email}
                            onChange={(e) => setPrivacySettings({...privacySettings, show_email: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Show Phone Number</p>
                          <p className="text-xs text-gray-500">Allow others to see your phone number</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.show_phone}
                            onChange={(e) => setPrivacySettings({...privacySettings, show_phone: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Allow Company Contact</p>
                          <p className="text-xs text-gray-500">Let companies reach out to you directly</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.allow_company_contact}
                            onChange={(e) => setPrivacySettings({...privacySettings, allow_company_contact: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Show Resume</p>
                          <p className="text-xs text-gray-500">Make your resume visible to companies</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.show_resume}
                            onChange={(e) => setPrivacySettings({...privacySettings, show_resume: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={savePrivacySettings}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Privacy Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                    <p className="text-sm text-gray-600 mb-6">Manage your account security</p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Password</p>
                            <p className="text-xs text-gray-500 mt-1">Change your password regularly to keep your account secure</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-500 mt-1">Coming soon - Add an extra layer of security</p>
                          </div>
                          <button
                            disabled
                            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-md cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                            <p className="text-xs text-gray-500 mt-1">Coming soon - Manage your active sessions</p>
                          </div>
                          <button
                            disabled
                            className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-200 rounded-md cursor-not-allowed"
                          >
                            Coming Soon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.new_password_confirmation}
                      onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: ''
                      });
                    }}
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

export default Settings;
