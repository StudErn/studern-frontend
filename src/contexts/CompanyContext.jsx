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
  const [availablePrivileges, setAvailablePrivileges] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  // Fetch user's companies
  const fetchUserCompanies = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/companies/my`);
      const data = response.data.data || [];
      setCompanies(data);
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new company
  const createCompany = async (companyData) => {
    try {
      const response = await axios.post(`${API_BASE}/companies`, companyData);
      const newCompany = response.data.data;
      
      // Update companies list immediately
      setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
      
      // Automatically select the newly created company
      selectCompany(newCompany);
      
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
      if (error.response?.status !== 403) {
        console.error('Error fetching company privileges:', error);
      }
      // Set default privileges if endpoint doesn't exist yet or fails
      // For 403 (not a member), set empty privileges
      if (error.response?.status === 403) {
        setCompanyPrivileges([]);
      } else {
        // For other errors, grant basic viewing permissions by default
        setCompanyPrivileges([
          { permission_name: 'can_view_jobs', is_granted: true },
          { permission_name: 'can_post_jobs', is_granted: true },
          { permission_name: 'can_manage_jobs', is_granted: true },
        ]);
      }
    }
  };

  // Canonical list that mirrors the backend ValidCompanyPrivilegeName whitelist exactly.
  // Keep this in sync with app/Rules/ValidCompanyPrivilegeName.php.
  const buildPrivilegeFallback = () => [
    { code: 'admin',                  name: 'Administrator',       description: 'Full administrative access to the company' },
    { code: 'editor',                 name: 'Editor',              description: 'Can edit company content and postings' },
    { code: 'viewer',                 name: 'Viewer',              description: 'Read-only access to company data' },
    { code: 'member',                 name: 'Member',              description: 'Basic company membership' },
    { code: 'can_manage_users',       name: 'Manage Members',      description: 'Invite and remove company members' },
    { code: 'can_manage_permissions', name: 'Manage Permissions',  description: 'Assign and revoke member privileges' },
    { code: 'can_manage_company',     name: 'Manage Company',      description: 'Update company profile and settings' },
    { code: 'can_post_jobs',          name: 'Post Jobs',           description: 'Create new job and internship postings' },
    { code: 'can_manage_jobs',        name: 'Manage Jobs',         description: 'Edit and delete job postings' },
    { code: 'can_view_jobs',          name: 'View Jobs',           description: 'View all job postings' },
    { code: 'can_apply_jobs',         name: 'Apply to Jobs',       description: 'Apply to jobs on behalf of the company' },
    { code: 'can_view_reports',       name: 'View Reports',        description: 'Access analytics and reports' },
    { code: 'can_manage_applications',name: 'Manage Applications', description: 'Review and manage job applications' },
  ];

  // Fetch available system privileges (admin endpoint). Falls back to defaults.
  const fetchAvailablePrivileges = async () => {
    // First check if user has system admin privileges
    try {
      const userPrivilegesResponse = await axios.get(`${API_BASE}/user/privileges`);
      const userPrivileges = userPrivilegesResponse.data.data;
      
      const hasSystemAdmin = userPrivileges?.system_privileges && userPrivileges.system_privileges.some(p => {
        return (p.privilege_code && p.privilege_code === 'manage_privileges_of_users') || p === 'manage_privileges_of_users';
      });
      
      if (!hasSystemAdmin) {
        // User is not a system admin, use fallback
const fallback = buildPrivilegeFallback();
        setAvailablePrivileges(fallback);
        return fallback;
      }
    } catch (error) {
      // If we can't check privileges, assume not admin and use fallback
      const fallback = buildPrivilegeFallback();
      setAvailablePrivileges(fallback);
      return fallback;
    }

    // User is a system admin, fetch from admin endpoint
    try {
      const response = await axios.get(`${API_BASE}/admin/privileges`);
      const data = response.data.data || [];
      // Normalize to { code, name, description }
      const normalized = data.map((p) => ({
        code: p.privilege_code || p.name || p.id,
        name: p.name || p.privilege_code || p.id,
        description: p.description || '',
      }));
      setAvailablePrivileges(normalized);
      return normalized;
    } catch (error) {
      // Even for admins, if the endpoint fails, use fallback
      const fallback = buildPrivilegeFallback();
      setAvailablePrivileges(fallback);
      return fallback;
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
      console.error('Error adding user to company:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add user',
        errors: error.response?.data?.messages || error.response?.data?.errors || {},
        status: error.response?.status,
        raw: error.response?.data,
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
      console.error('Error managing privileges:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to manage privileges',
        errors: error.response?.data?.messages || error.response?.data?.errors || {},
        status: error.response?.status,
        raw: error.response?.data,
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

  // Remove a user from the company
  const removeUserFromCompany = async (companyId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE}/companies/${companyId}/users/${userId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error removing user from company:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove user',
        status: error.response?.status,
        raw: error.response?.data,
      };
    }
  };

  // Update company details
  const updateCompany = async (companyId, companyData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE}/companies/${companyId}`, companyData);
      const updated = response.data.data;

      // Update companies list and selectedCompany if needed
      setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      const saved = localStorage.getItem('selectedCompany');
      if (saved) {
        const sc = JSON.parse(saved);
        if (sc.id === updated.id) {
          setSelectedCompany(updated);
          localStorage.setItem('selectedCompany', JSON.stringify(updated));
        }
      }

      return { success: true, data: updated };
    } catch (error) {
      console.error('Error updating company:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update company',
        errors: error.response?.data?.errors || error.response?.data?.messages || {},
      };
    } finally {
      setLoading(false);
    }
  };

  // Initialize from localStorage
  useEffect(() => {
    const initializeCompanyContext = async () => {
      if (isAuthenticated) {
        // First fetch user companies and get the fresh list
        const fetched = await fetchUserCompanies();

        // Then check if saved company is valid
        const savedCompany = localStorage.getItem('selectedCompany');
        if (savedCompany) {
          const company = JSON.parse(savedCompany);
          // Check if the saved company is in user's companies
          const isValidCompany = fetched.some(c => c.id === company.id);
          if (isValidCompany) {
            setSelectedCompany(company);
            fetchCompanyPrivileges(company.id);
          } else {
            // Clear invalid saved company
            localStorage.removeItem('selectedCompany');
          }
        }
      }
    };
    
    initializeCompanyContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value = {
    companies,
    selectedCompany,
    loading,
    companyPrivileges,
    availablePrivileges,
    fetchUserCompanies,
    createCompany,
    updateCompany,
    selectCompany,
    hasPrivilege,
    addUserToCompany,
    manageUserPrivileges,
    removeUserFromCompany,
    getCompanyUsers,
    fetchAvailablePrivileges,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
