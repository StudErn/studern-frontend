import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'
import Footer from '../components/Footer'
import axios from 'axios'

const SystemSettings = () => {
    const { user } = useAuth()
    const [settings, setSettings] = useState({})
    const [systemDetails, setSystemDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('settings')
    const [activeGroup, setActiveGroup] = useState('general')
    const [unsavedChanges, setUnsavedChanges] = useState(false)

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

    useEffect(() => {
        fetchSettings()
        fetchSystemDetails()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`/system/settings`)
            const groupedSettings = response.data.data.settings
            setSettings(groupedSettings)
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            alert('Failed to load settings: ' + (error.response?.data?.message || error.message))
        } finally {
            setLoading(false)
        }
    }

    const fetchSystemDetails = async () => {
        try {
            const response = await axios.get(`/system/details`)
            setSystemDetails(response.data.data.system_details)
        } catch (error) {
            console.error('Failed to fetch system details:', error)
            // Don't show alert for system details failure, just log it
        }
    }

    const handleSettingChange = (group, key, value, type) => {
        // Convert value based on type
        let processedValue = value
        if (type === 'boolean') {
            processedValue = value === 'true' || value === true
        } else if (type === 'number' || type === 'integer' || type === 'float') {
            processedValue = Number(value)
        }

        setSettings(prev => ({
            ...prev,
            [group]: {
                ...prev[group],
                [key]: {
                    ...prev[group][key],
                    value: processedValue
                }
            }
        }))
        setUnsavedChanges(true)
    }

    const saveSettings = async () => {
        setSaving(true)
        try {
            const settingsToUpdate = []

            // Flatten settings for bulk update
            Object.keys(settings).forEach(group => {
                Object.keys(settings[group]).forEach(key => {
                    const setting = settings[group][key]
                    settingsToUpdate.push({
                        key: key,
                        value: setting.value,
                        type: setting.type,
                        group: group
                    })
                })
            })

            await axios.post(`${API_BASE}/system/settings/bulk`, {
                settings: settingsToUpdate
            })

            setUnsavedChanges(false)
            alert('Settings saved successfully!')
        } catch (error) {
            console.error('Failed to save settings:', error)
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const getGroups = () => {
        return Object.keys(settings)
    }

    const getSettingsForGroup = (group) => {
        return settings[group] || {}
    }

    const renderSettingInput = (setting, group) => {
        const { key, value, type, label, description } = setting

        switch (type) {
            case 'boolean':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={key}
                            checked={value === true || value === 'true'}
                            onChange={(e) => handleSettingChange(group, key, e.target.checked, type)}
                            className="h-4 w-4 text-[#00B8D4] focus:ring-[#00B8D4] border-gray-300 rounded"
                        />
                        <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                            {label}
                        </label>
                    </div>
                )
            case 'text':
                return (
                    <div>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <textarea
                            id={key}
                            value={value || ''}
                            onChange={(e) => handleSettingChange(group, key, e.target.value, type)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-[#00B8D4]"
                            placeholder={description}
                        />
                    </div>
                )
            case 'number':
            case 'integer':
            case 'float':
                return (
                    <div>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <input
                            type="number"
                            id={key}
                            value={value || ''}
                            onChange={(e) => handleSettingChange(group, key, e.target.value, type)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-[#00B8D4]"
                            placeholder={description}
                        />
                    </div>
                )
            default: // string
                return (
                    <div>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <input
                            type="text"
                            id={key}
                            value={value || ''}
                            onChange={(e) => handleSettingChange(group, key, e.target.value, type)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-[#00B8D4]"
                            placeholder={description}
                        />
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <DashboardHeader />
                <div className="flex flex-1">
                    <DashboardSidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading settings...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />

            <div className="flex flex-1">
                <DashboardSidebar />

                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-6 py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1A3C40]">
                                System Management
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Manage website settings and view system information
                            </p>
                        </div>

                        {/* Main Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'settings'
                                                ? 'border-[#00B8D4] text-[#00B8D4]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('system-info')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'system-info'
                                                ? 'border-[#00B8D4] text-[#00B8D4]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        System Info
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                {/* Group Tabs */}
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6">
                                        {getGroups().map((group) => (
                                            <button
                                                key={group}
                                                onClick={() => setActiveGroup(group)}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                                    activeGroup === group
                                                        ? 'border-[#00B8D4] text-[#00B8D4]'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {group.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Settings Form */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {Object.entries(getSettingsForGroup(activeGroup)).map(([key, setting]) => (
                                            <div key={key} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                                                {renderSettingInput({
                                                    key,
                                                    ...setting
                                                }, activeGroup)}
                                                {setting.description && (
                                                    <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex justify-end space-x-4">
                                        {unsavedChanges && (
                                            <span className="text-sm text-orange-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                You have unsaved changes
                                            </span>
                                        )}
                                        <button
                                            onClick={saveSettings}
                                            disabled={saving || !unsavedChanges}
                                            className={`px-6 py-2 rounded-lg font-medium text-sm ${
                                                saving || !unsavedChanges
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-[#00B8D4] text-white hover:bg-opacity-90'
                                            }`}
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Info Tab */}
                        {activeTab === 'system-info' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-[#1A3C40] mb-6">System Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(systemDetails).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                    {key.replace(/_/g, ' ')}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    )
}

export default SystemSettings