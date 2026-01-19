import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyPrivileges, setCompanyPrivileges] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  // Fetch user's companies
  const fetchUserCompanies = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/companies/my`);
      setCompanies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new company
  const createCompany = async (companyData) => {
    try {
      const response = await axios.post(`${API_BASE}/companies`, companyData);
      const newCompany = response.data.data;
      setCompanies([...companies, newCompany]);
      return { success: true, data: newCompany };
    } catch (error) {
      console.error('Error creating company:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create company',
      };
    }
  };

  // Select a company for context
  const selectCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    // Fetch company privileges when company is selected
    if (company) {
      fetchCompanyPrivileges(company.id);
    }
  };

  // Fetch company privileges for the current user
  const fetchCompanyPrivileges = async (companyId) => {
    try {
      // This would need a backend endpoint to get user's privileges in a company
      // For now, we'll use a placeholder
      const response = await axios.get(`${API_BASE}/companies/${companyId}/my-privileges`);
      setCompanyPrivileges(response.data.data || []);
    } catch (error) {
      console.error('Error fetching company privileges:', error);
      // Set default privileges if endpoint doesn't exist yet
      setCompanyPrivileges([]);
    }
  };

  // Check if user has a specific privilege
  const hasPrivilege = (privilegeName) => {
    return companyPrivileges.some(
      (priv) => priv.permission_name === privilegeName && priv.is_granted
    ) || companyPrivileges.some(
      (priv) => priv.permission_name === 'admin' && priv.is_granted
    );
  };

  // Add user to company
  const addUserToCompany = async (companyId, userData) => {
    try {
      const response = await axios.post(
        `${API_BASE}/companies/${companyId}/users`,
        userData
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error adding user to company:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add user',
      };
    }
  };

  // Manage user privileges in company
  const manageUserPrivileges = async (companyId, userId, privileges) => {
    try {
      const response = await axios.post(
        `${API_BASE}/companies/${companyId}/users/${userId}/privileges`,
        { privileges }
      );
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error managing privileges:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to manage privileges',
      };
    }
  };

  // Get company users
  const getCompanyUsers = async (companyId) => {
    try {
      const response = await axios.get(`${API_BASE}/companies/${companyId}/users`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching company users:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  };

  // Initialize from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const savedCompany = localStorage.getItem('selectedCompany');
      if (savedCompany) {
        const company = JSON.parse(savedCompany);
        setSelectedCompany(company);
        fetchCompanyPrivileges(company.id);
      }
      fetchUserCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value = {
    companies,
    selectedCompany,
    loading,
    companyPrivileges,
    fetchUserCompanies,
    createCompany,
    selectCompany,
    hasPrivilege,
    addUserToCompany,
    manageUserPrivileges,
    getCompanyUsers,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
