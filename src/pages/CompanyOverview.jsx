import React from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const CompanyOverview = () => {
  const { selectedCompany, hasPrivilege } = useCompany();
  const navigate = useNavigate();
  const { companyId } = useParams();

  if (!selectedCompany) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      label: 'Active Postings',
      value: '0',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Members',
      value: '1',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Applications',
      value: '0',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'This Month',
      value: '0',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
          <p className="text-gray-600 mt-1">Manage your company and hiring activities</p>
        </div>
        {hasPrivilege('can_post_jobs') && (
          <button
            onClick={() => navigate(`/company/${companyId}/hiring/create`)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
          >
            <Plus className="w-5 h-5" />
            Create Posting
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium">Company Name</p>
            <p className="text-base text-gray-900 mt-1">{selectedCompany.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Industry</p>
            <p className="text-base text-gray-900 mt-1">{selectedCompany.industry_type}</p>
          </div>
          {selectedCompany.number_of_employees && (
            <div>
              <p className="text-sm text-gray-600 font-medium">Number of Employees</p>
              <p className="text-base text-gray-900 mt-1">{selectedCompany.number_of_employees}</p>
            </div>
          )}
          {selectedCompany.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 font-medium">Description</p>
              <p className="text-base text-gray-900 mt-1">{selectedCompany.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasPrivilege('can_post_jobs') && (
            <button
              onClick={() => navigate(`/company/${companyId}/hiring`)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#00B8D4] hover:bg-blue-50 transition text-left"
            >
              <Briefcase className="w-6 h-6 text-[#00B8D4] mb-2" />
              <h4 className="font-semibold text-gray-900">Manage Postings</h4>
              <p className="text-sm text-gray-600 mt-1">Create and edit job listings</p>
            </button>
          )}
          {hasPrivilege('can_manage_users') && (
            <button
              onClick={() => navigate(`/company/${companyId}/members`)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#00B8D4] hover:bg-blue-50 transition text-left"
            >
              <Users className="w-6 h-6 text-[#00B8D4] mb-2" />
              <h4 className="font-semibold text-gray-900">Team Members</h4>
              <p className="text-sm text-gray-600 mt-1">Manage users and permissions</p>
            </button>
          )}
          <button
            onClick={() => navigate(`/jobs?company=${companyId}`)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#00B8D4] hover:bg-blue-50 transition text-left"
          >
            <TrendingUp className="w-6 h-6 text-[#00B8D4] mb-2" />
            <h4 className="font-semibold text-gray-900">View Applications</h4>
            <p className="text-sm text-gray-600 mt-1">See who's applied to your postings</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
