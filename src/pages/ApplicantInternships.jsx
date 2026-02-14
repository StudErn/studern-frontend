import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHiring } from '../contexts/HiringContext';
import {
  GraduationCap,
  MapPin,
  Clock,
  Search,
  Filter,
  Building2,
  Calendar,
  Users,
  ArrowLeft
} from 'lucide-react';

const ApplicantInternships = () => {
  const navigate = useNavigate();
  const { browseJobs, loading } = useHiring();

  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    work_from: 'all',
    employment_type: 'all',
  });

  useEffect(() => {
    loadInternships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [internships, searchTerm, filters]);

  const loadInternships = async () => {
    const result = await browseJobs({ hiring_type: 'internship' });
    if (result.success) {
      setInternships(result.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (internship) =>
          internship.job_title?.toLowerCase().includes(term) ||
          internship.description?.toLowerCase().includes(term) ||
          internship.company?.name?.toLowerCase().includes(term)
      );
    }

    // Type filters
    if (filters.work_from !== 'all') {
      filtered = filtered.filter((internship) => internship.work_from === filters.work_from);
    }
    if (filters.employment_type !== 'all') {
      filtered = filtered.filter(
        (internship) => internship.employment_type === filters.employment_type
      );
    }

    setFilteredInternships(filtered);
  };

  const formatStipend = (internship) => {
    if (internship.internship_details) {
      const intern = internship.internship_details;
      const min = intern.min_stipend?.toLocaleString() || '0';
      const max = intern.max_stipend?.toLocaleString();
      
      if (max) return `${intern.currency} ${min} - ${max} / ${intern.pay_per}`;
      if (min !== '0') return `${intern.currency} ${min} / ${intern.pay_per}`;
      return 'Unpaid / Learning Opportunity';
    }
    return 'Not specified';
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/find-jobs')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#1A3C40] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Find Opportunities
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3C40]">Find Internships</h1>
        <p className="text-gray-500 mt-1">Discover internship opportunities to gain experience</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by internship title, skill, or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            <select
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
              value={filters.work_from}
              onChange={(e) => setFilters({ ...filters, work_from: e.target.value })}
            >
              <option value="all">Work Location</option>
              <option value="office">In Office</option>
              <option value="home">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
              value={filters.employment_type}
              onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })}
            >
              <option value="all">Duration</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/find-jobs/${internship.id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {internship.company?.logo ? (
                        <img
                          src={internship.company.logo}
                          alt={internship.company.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#1A3C40]/5 flex items-center justify-center border border-[#1A3C40]/10">
                          <Building2 className="w-8 h-8 text-[#1A3C40]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-[#00B8D4] transition-colors">
                        {internship.job_title}
                      </h3>
                      <p className="text-gray-600 font-medium mb-2">{internship.company?.name}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          <span className="capitalize">{internship.hiring_type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="capitalize">{internship.work_from.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span className="capitalize">{internship.employment_type?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                            {formatStipend(internship)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side / Meta */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm text-gray-400">
                      Posted {new Date(internship.posted_at).toLocaleDateString()}
                    </span>
                    <button className="px-6 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-lg hover:bg-[#1A3C40]/90 transition-colors mt-4 md:mt-0">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No internships found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ work_from: 'all', employment_type: 'all' });
                }}
                className="mt-4 text-[#00B8D4] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantInternships;