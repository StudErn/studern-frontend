import React, { useState, useEffect } from 'react';
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import {
  Briefcase,
  Users,
  Building2,
  Settings,
  PlusCircle,
  ChevronDown,
  Home,
  FileText,
} from 'lucide-react';

const CompanyDashboard = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { companies, selectedCompany, selectCompany, hasPrivilege } = useCompany();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (companyId && companies.length > 0) {
      const company = companies.find((c) => c.id === parseInt(companyId));
      if (company && (!selectedCompany || selectedCompany.id !== company.id)) {
        selectCompany(company);
      }
    }
  }, [companyId, companies]);

  const menuItems = [
    {
      icon: Home,
      label: 'Overview',
      path: `/company/${companyId}`,
      permission: null,
    },
    {
      icon: Briefcase,
      label: 'Hiring',
      path: `/company/${companyId}/hiring`,
      permission: 'can_view_jobs',
    },
    {
      icon: Users,
      label: 'Members',
      path: `/company/${companyId}/members`,
      permission: 'can_manage_users',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: `/company/${companyId}/settings`,
      permission: 'can_manage_company',
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.permission || hasPrivilege(item.permission)
  );

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00B8D4] to-[#0097a7] rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedCompany.name}</h1>
                <p className="text-sm text-gray-500">{selectedCompany.industry_type}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] transition-all duration-300`}
        >
          <nav className="p-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-[#00B8D4] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}

            {hasPrivilege('can_post_jobs') && (
              <>
                <div className="pt-4 pb-2">
                  {isSidebarOpen && (
                    <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Quick Actions
                    </h3>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/company/${companyId}/hiring/create`)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <PlusCircle className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="font-medium">New Posting</span>}
                </button>
              </>
            )}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarOpen ? '← Collapse' : '→'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
