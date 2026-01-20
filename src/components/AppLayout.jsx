import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useView } from '../contexts/ViewContext';
import { useCompany } from '../contexts/CompanyContext';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const AppLayout = () => {
  const { user } = useAuth();
  const { selectedView, changeView } = useView();
  const { companies, selectedCompany, selectCompany } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleViewChange = (newView) => {
    changeView(newView);
    // Navigate to appropriate dashboard based on view
    if (newView === 'recruiter') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleCompanyChange = (companyId) => {
    // Accept either company object or id
    if (!companyId) return;
    let company = companyId;
    if (typeof companyId === 'number' || typeof companyId === 'string') {
      company = companies.find((c) => String(c.id) === String(companyId));
    }
    if (company) selectCompany(company);
    navigate('/dashboard');
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    ];

    const view = selectedView;

    if (view === 'applicant') {
      return [
        ...baseItems,
        { path: '/find-jobs', label: 'Find Jobs & Internships', icon: 'Search' },
        { path: '/applications', label: 'Applications', icon: 'FileText' },
        { path: '/saved-jobs', label: 'Saved Jobs', icon: 'Bookmark' },
        { path: '/interviews', label: 'Interviews', icon: 'Calendar' },
        { path: '/profile', label: 'Profile', icon: 'User' },
      ];
    } else if (view === 'recruiter') {
      return [
        ...baseItems,
        { path: '/dashboard/jobs', label: 'Manage Jobs', icon: 'Briefcase' },
        { path: '/dashboard/members', label: 'Members', icon: 'Users' },
        // Add more recruiter items as needed
      ];
    } else if (user.role === 'admin') {
      return [
        { path: '/admin/users', label: 'Users', icon: 'Users' },
        { path: '/admin/companies', label: 'Companies', icon: 'Building' },
        { path: '/admin/hiring', label: 'Hiring', icon: 'FileText' },
        { path: '/system-settings', label: 'System Settings', icon: 'Settings' },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        user={user}
        view={selectedView}
        companies={companies}
        selectedCompany={selectedCompany}
        onViewChange={handleViewChange}
        onCompanyChange={handleCompanyChange}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <DashboardSidebar
          menuItems={menuItems}
          isActivePath={isActivePath}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;