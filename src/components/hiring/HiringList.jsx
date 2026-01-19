import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHiring } from '../../contexts/HiringContext';
import { useCompany } from '../../contexts/CompanyContext';
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
} from 'lucide-react';

const HiringList = () => {
  const navigate = useNavigate();
  const { selectedCompany, hasPrivilege } = useCompany();
  const { getCompanyHirings, deleteHiring, loading } = useHiring();
  const [hirings, setHirings] = useState([]);
  const [filteredHirings, setFilteredHirings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hiring_type: 'all',
    work_from: 'all',
    employment_type: 'all',
    status: 'all',
  });

  const canManage = hasPrivilege('can_manage_jobs');
  const canPost = hasPrivilege('can_post_jobs');

  useEffect(() => {
    if (selectedCompany) {
      loadHirings();
    }
  }, [selectedCompany]);

  useEffect(() => {
    applyFilters();
  }, [hirings, searchTerm, filters]);

  const loadHirings = async () => {
    if (!selectedCompany) return;
    const result = await getCompanyHirings(selectedCompany.id);
    if (result.success) {
      setHirings(result.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...hirings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (h) =>
          h.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filters
    if (filters.hiring_type !== 'all') {
      filtered = filtered.filter((h) => h.hiring_type === filters.hiring_type);
    }
    if (filters.work_from !== 'all') {
      filtered = filtered.filter((h) => h.work_from === filters.work_from);
    }
    if (filters.employment_type !== 'all') {
      filtered = filtered.filter((h) => h.employment_type === filters.employment_type);
    }

    // Status filter (based on closing date)
    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter((h) => {
        const closingDate = new Date(h.closing_at);
        const isActive = closingDate > now;
        return filters.status === 'active' ? isActive : !isActive;
      });
    }

    setFilteredHirings(filtered);
  };

  const handleDelete = async (hiringId) => {
    if (!window.confirm('Are you sure you want to delete this posting?')) return;

    const result = await deleteHiring(companyId, hiringId);
    if (result.success) {
      loadHirings();
    }
  };

  const getStatusBadge = (closingAt) => {
    const now = new Date();
    const closing = new Date(closingAt);
    const isActive = closing > now;

    return isActive ? (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
        Closed
      </span>
    );
  };

  const formatSalary = (hiring) => {
    if (hiring.hiring_type === 'job' && hiring.job_detail) {
      const job = hiring.job_detail;
      if (job.payment_type === 'fixed_pay') {
        if (job.min_salary && job.max_salary) {
          return `${job.currency} ${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()} / ${job.pay_per}`;
        }
        return `${job.currency} ${job.min_salary?.toLocaleString() || 'N/A'} / ${job.pay_per}`;
      }
      return 'Performance based';
    } else if (hiring.hiring_type === 'internship' && hiring.internship_detail) {
      const intern = hiring.internship_detail;
      if (intern.min_stipend && intern.max_stipend) {
        return `${intern.currency} ${intern.min_stipend.toLocaleString()} - ${intern.max_stipend.toLocaleString()} / ${intern.pay_per}`;
      }
      return 'Unpaid / Learning';
    }
    return 'Not specified';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[#00B8D4]" />
            Hiring Postings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your job and internship postings
          </p>
        </div>
        {canPost && (
          <button
            onClick={() => navigate(`/company/${companyId}/hiring/create`)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
          >
            <Plus className="w-5 h-5" />
            New Posting
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search postings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filters.hiring_type}
            onChange={(e) => setFilters({ ...filters, hiring_type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="job">Jobs</option>
            <option value="internship">Internships</option>
          </select>

          <select
            value={filters.work_from}
            onChange={(e) => setFilters({ ...filters, work_from: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
          >
            <option value="all">All Arrangements</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredHirings.length} of {hirings.length} posting(s)
      </div>

      {/* Hiring Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4]"></div>
          <p className="text-gray-600 mt-4">Loading postings...</p>
        </div>
      ) : filteredHirings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No postings found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || Object.values(filters).some((f) => f !== 'all')
              ? 'Try adjusting your filters'
              : 'Create your first job or internship posting'}
          </p>
          {canPost && (
            <button
              onClick={() => navigate(`/company/${companyId}/hiring/create`)}
              className="px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition"
            >
              Create Posting
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredHirings.map((hiring) => (
            <div
              key={hiring.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {hiring.job_title}
                      </h3>
                      {getStatusBadge(hiring.closing_at)}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                        {hiring.hiring_type}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {hiring.employment_type}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {hiring.work_from}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#00B8D4]">
                        {formatSalary(hiring)}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {hiring.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {hiring.num_of_openings} opening(s)
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Closes: {new Date(hiring.closing_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted: {new Date(hiring.posted_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Perks */}
                {((hiring.hiring_type === 'job' &&
                  hiring.job_detail?.perks?.length > 0) ||
                  (hiring.hiring_type === 'internship' &&
                    hiring.internship_detail?.perks?.length > 0)) && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {(hiring.hiring_type === 'job'
                        ? hiring.job_detail.perks
                        : hiring.internship_detail.perks
                      ).map((perk, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() =>
                      navigate(`/company/${companyId}/hiring/${hiring.id}`)
                    }
                    className="flex items-center gap-2 px-4 py-2 text-[#00B8D4] border-2 border-[#00B8D4] rounded-lg font-semibold hover:bg-[#00B8D4] hover:text-white transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/company/${companyId}/hiring/${hiring.id}/edit`)
                        }
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hiring.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HiringList;
