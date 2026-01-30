import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const HiringContext = createContext();

export const useHiring = () => {
  const context = useContext(HiringContext);
  if (!context) {
    throw new Error('useHiring must be used within a HiringProvider');
  }
  return context;
};

export const HiringProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  // Create hiring detail
  const createHiring = async (companyId, hiringData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/companies/${companyId}/hiring`,
        hiringData
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error creating hiring:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create posting',
        errors: error.response?.data?.errors || error.response?.data?.messages || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // Check if posting is free
  const checkIfFreePosting = async (companyId) => {
    try {
      const response = await axios.get(
        `${API_BASE}/companies/${companyId}/check-free-posting`
      );
      return { success: true, isFree: response.data.is_free };
    } catch (error) {
      console.error('Error checking free posting:', error);
      return { success: false, isFree: false };
    }
  };

  // Get all company hirings
  const getCompanyHirings = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/companies/${companyId}/hiring`
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching company hirings:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch postings',
      };
    } finally {
      setLoading(false);
    }
  };

  // Get specific hiring detail
  const getHiringDetail = async (companyId, hiringId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/companies/${companyId}/hiring/${hiringId}`
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching hiring detail:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch posting',
      };
    } finally {
      setLoading(false);
    }
  };

  // Update hiring detail
  const updateHiring = async (companyId, hiringId, hiringData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE}/companies/${companyId}/hiring/${hiringId}`,
        hiringData
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error updating hiring:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update posting',
        errors: error.response?.data?.errors || error.response?.data?.messages || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete hiring detail
  const deleteHiring = async (companyId, hiringId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/companies/${companyId}/hiring/${hiringId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting hiring:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete posting',
      };
    } finally {
      setLoading(false);
    }
  };

  // Browse public job postings
  const browseJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      // This would be a public endpoint to browse all active jobs
      const response = await axios.get(`${API_BASE}/hiring/browse?${params}`);
      // Handle pagination: if response.data.data has a 'data' property (Laravel Paginator), use it
      const jobs = response.data.data?.data || response.data.data || [];
      return { success: true, data: jobs };
    } catch (error) {
      console.error('Error browsing jobs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to browse jobs',
      };
    } finally {
      setLoading(false);
    }
  };

  // Apply to a job
  const applyToJob = async (hiringId, applicationData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/hiring/${hiringId}/apply`,
        applicationData
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error applying to job:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit application',
        errors: error.response?.data?.errors || error.response?.data?.messages || {},
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    createHiring,
    checkIfFreePosting,
    getCompanyHirings,
    getHiringDetail,
    updateHiring,
    deleteHiring,
    browseJobs,
    applyToJob,
  };

  return <HiringContext.Provider value={value}>{children}</HiringContext.Provider>;
};
