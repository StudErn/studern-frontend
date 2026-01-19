import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useHiring } from '../contexts/HiringContext';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Building2,
  Calendar,
  Users,
  ChevronRight,
} from 'lucide-react';

const JobBrowse = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { browseJobs, loading } = useHiring();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hiring_type: 'all',
    work_from: 'all',
    employment_type: 'all',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  const loadJobs = async () => {
    const result = await browseJobs();
    if (result.success) {
      setJobs(result.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filters
    if (filters.hiring_type !== 'all') {
      filtered = filtered.filter((job) => job.hiring_type === filters.hiring_type);
    }
    if (filters.work_from !== 'all') {
      filtered = filtered.filter((job) => job.work_from === filters.work_from);
    }
    if (filters.employment_type !== 'all') {
      filtered = filtered.filter(
        (job) => job.employment_type === filters.employment_type
      );
    }

    setFilteredJobs(filtered);
  };

  const formatSalary = (job) => {
    if (job.hiring_type === 'job' && job.job_detail) {
      const jobDetail = job.job_detail;
      if (jobDetail.payment_type === 'fixed_pay') {
        if (jobDetail.min_salary && jobDetail.max_salary) {
          return `${jobDetail.currency} ${jobDetail.min_salary.toLocaleString()} - ${jobDetail.max_salary.toLocaleString()} / ${jobDetail.pay_per}`;
        }
        return `${jobDetail.currency} ${jobDetail.min_salary?.toLocaleString() || 'N/A'} / ${jobDetail.pay_per}`;
      }
      return 'Performance based';
    } else if (job.hiring_type === 'internship' && job.internship_detail) {
      const intern = job.internship_detail;
      if (intern.min_stipend && intern.max_stipend) {
        return `${intern.currency} ${intern.min_stipend.toLocaleString()} - ${intern.max_stipend.toLocaleString()} / ${intern.pay_per}`;
      } else if (intern.min_stipend) {
        return `${intern.currency} ${intern.min_stipend.toLocaleString()} / ${intern.pay_per}`;
      }
      return 'Unpaid / Learning Opportunity';
    }
    return 'Compensation not specified';
  };

  const getDaysRemaining = (closingAt) => {
    const now = new Date();
    const closing = new Date(closingAt);
    const diffTime = closing - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Closed';
    if (diffDays === 0) return 'Closes today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1A3C40] to-[#00B8D4] rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Opportunity</h1>
        <p className="text-lg text-white/90">
          Explore jobs and internships from top companies
        </p>
        <div className="mt-6 bg-white rounded-lg p-2 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, companies, keywords..."
              className="w-full pl-10 pr-4 py-3 text-gray-900 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
            />
          </div>
          <button className="px-6 py-3 bg-[#00B8D4] text-white rounded-lg font-semibold hover:bg-[#0097a7] transition">
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opportunity Type
            </label>
            <select
              value={filters.hiring_type}
              onChange={(e) =>
                setFilters({ ...filters, hiring_type: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="job">Jobs</option>
              <option value="internship">Internships</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Arrangement
            </label>
            <select
              value={filters.work_from}
              onChange={(e) =>
                setFilters({ ...filters, work_from: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
            >
              <option value="all">All Arrangements</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              value={filters.employment_type}
              onChange={(e) =>
                setFilters({ ...filters, employment_type: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          {filteredJobs.length} opportunity(ies) found
        </p>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4]"></div>
          <p className="text-gray-600 mt-4">Loading opportunities...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No opportunities found
          </h3>
          <p className="text-gray-600">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00B8D4] to-[#0097a7] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {job.company?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00B8D4] transition">
                          {job.job_title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company?.name || 'Company'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#00B8D4]">
                      {formatSalary(job)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {getDaysRemaining(job.closing_at)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                    {job.hiring_type}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {job.employment_type}
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.work_from}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.num_of_openings} opening(s)
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posted {new Date(job.posted_at).toLocaleDateString()}
                  </div>
                  {job.hiring_type === 'job' && job.job_detail?.experience_year && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.job_detail.experience_year} year(s) experience
                    </div>
                  )}
                </div>

                {/* Perks Preview */}
                {((job.hiring_type === 'job' && job.job_detail?.perks?.length > 0) ||
                  (job.hiring_type === 'internship' &&
                    job.internship_detail?.perks?.length > 0)) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {(job.hiring_type === 'job'
                        ? job.job_detail.perks
                        : job.internship_detail.perks
                      )
                        .slice(0, 3)
                        .map((perk, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      {(job.hiring_type === 'job'
                        ? job.job_detail.perks.length
                        : job.internship_detail.perks.length) > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +
                          {(job.hiring_type === 'job'
                            ? job.job_detail.perks.length
                            : job.internship_detail.perks.length) - 3}{' '}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-[#00B8D4] font-semibold group-hover:underline">
                    View Details & Apply
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#00B8D4] group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBrowse;
