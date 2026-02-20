import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHiring } from '../contexts/HiringContext';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
  Building2,
  Calendar,
  Users,
  ArrowLeft
} from 'lucide-react';

const ApplicantJobs = () => {
  const navigate = useNavigate();
  const { browseJobs, loading } = useHiring();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    work_from: 'all',
    employment_type: 'all',
  });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  const loadJobs = async () => {
    const result = await browseJobs({ hiring_type: 'job' });
    if (result.success) {
      setJobs(result.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.job_title?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term) ||
          job.company?.name?.toLowerCase().includes(term)
      );
    }

    // Type filters
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

  // const formatSalary = (job) => {
  //   if (job.job_detail || job.job_details) {
  //     const jobDetail = job.job_detail || job.job_details;
  //     if (jobDetail.payment_type === 'fixed_pay') {
  //       const min = jobDetail.min_salary?.toLocaleString() || '0';
  //       const max = jobDetail.max_salary?.toLocaleString();
        
  //       if (max) return `${jobDetail.currency || 'BDT'} ${min} - ${max} / ${jobDetail.pay_per || 'year'}`;
  //       return `${jobDetail.currency || 'BDT'} ${min} / ${jobDetail.pay_per || 'year'}`;
  //     }
  //     return 'Performance based';
  //   }
  //   return 'Not specified';
  // };

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
        <h1 className="text-3xl font-bold text-[#1A3C40]">Find Jobs</h1>
        <p className="text-gray-500 mt-1">Browse full-time and part-time job opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job title, skill, or company..."
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
              <option value="all">Employment</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-6 bg-gray-200 rounded-full w-16" />
                <div className="h-6 bg-gray-200 rounded-full w-24" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-32" />
                <div className="h-9 bg-gray-200 rounded-full w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-700 font-semibold">No jobs found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query</p>
          <button
            onClick={() => { setSearchTerm(''); setFilters({ work_from: 'all', employment_type: 'all' }); }}
            className="mt-4 text-sm text-[#00B8D4] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const detail = job.job_detail || job.internship_detail;
            const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : null) || 'Company';
            const postedDate = job.posted_at ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
            const closingDate = job.closing_at ? new Date(job.closing_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
            return (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={companyName} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#1A3C40] flex items-center justify-center text-white font-bold text-lg">
                        {companyName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{companyName}</p>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5 leading-snug">{job.job_title}</h3>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {job.employment_type && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">{job.employment_type.replace(/_/g, ' ')}</span>
                  )}
                  {job.work_from && (
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full capitalize">📍 {job.work_from.replace(/_/g, ' ')}</span>
                  )}
                  {job.num_of_openings > 0 && (
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">👥 {job.num_of_openings} opening{job.num_of_openings > 1 ? 's' : ''}</span>
                  )}
                  {detail?.experience_year !== undefined && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">🎓 {detail.experience_year}+ yr exp</span>
                  )}
                </div>

                {/* Description */}
                {job.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{job.description}</p>
                )}

                {/* Compensation */}
                {(detail?.min_salary || detail?.min_stipend) && (
                  <p className="text-sm font-semibold text-[#1A3C40]">
                    💰 {detail.currency || 'BDT'} {(detail.min_salary || detail.min_stipend)?.toLocaleString()}
                    {(detail.max_salary || detail.max_stipend) ? ` – ${(detail.max_salary || detail.max_stipend)?.toLocaleString()}` : ''}
                    <span className="font-normal text-gray-400"> / {detail.pay_per || 'month'}</span>
                  </p>
                )}

                {/* Perks preview */}
                {detail?.perks?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {detail.perks.slice(0, 3).map((perk, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#1A3C40]/5 text-[#1A3C40] text-xs rounded-full">✓ {perk}</span>
                    ))}
                    {detail.perks.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">+{detail.perks.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <span className="text-xs text-gray-400">
                    {postedDate && `Posted ${postedDate}`}{closingDate && ` · Closes ${closingDate}`}
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-5 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-full hover:bg-[#1A3C40]/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 flex items-start gap-4 rounded-t-3xl sm:rounded-t-2xl z-10">
              {selectedJob.company?.logo ? (
                <img src={selectedJob.company.logo} alt={selectedJob.company?.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#1A3C40] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {(selectedJob.company?.name || (typeof selectedJob.company === 'string' ? selectedJob.company : null) || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{selectedJob.company?.name || selectedJob.company}</p>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">{selectedJob.job_title}</h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedJob.hiring_type && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full capitalize">{selectedJob.hiring_type}</span>}
                  {selectedJob.employment_type && <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full capitalize">{selectedJob.employment_type.replace(/_/g, ' ')}</span>}
                  {selectedJob.work_from && <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full capitalize">{selectedJob.work_from.replace(/_/g, ' ')}</span>}
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none p-1 flex-shrink-0">×</button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {(() => {
                const d = selectedJob.job_detail || selectedJob.internship_detail;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedJob.num_of_openings > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Openings</p>
                        <p className="font-bold text-gray-900">{selectedJob.num_of_openings}</p>
                      </div>
                    )}
                    {d?.experience_year !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Experience</p>
                        <p className="font-bold text-gray-900">{d.experience_year}+ years</p>
                      </div>
                    )}
                    {d?.duration_months && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                        <p className="font-bold text-gray-900">{d.duration_months} months</p>
                      </div>
                    )}
                    {(d?.min_salary || d?.min_stipend) && (
                      <div className="bg-[#1A3C40]/5 rounded-xl p-3 border border-[#1A3C40]/10">
                        <p className="text-xs text-gray-400 mb-1">{selectedJob.hiring_type === 'internship' ? 'Stipend' : 'Salary'}</p>
                        <p className="font-bold text-[#1A3C40] text-sm">
                          {d.currency || 'BDT'} {(d.min_salary || d.min_stipend)?.toLocaleString()}
                          {(d.max_salary || d.max_stipend) ? `–${(d.max_salary || d.max_stipend)?.toLocaleString()}` : ''}
                          <span className="font-normal text-gray-400 text-xs"> / {d.pay_per || 'month'}</span>
                        </p>
                      </div>
                    )}
                    {selectedJob.closing_at && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Deadline</p>
                        <p className="font-bold text-gray-900 text-sm">{new Date(selectedJob.closing_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    )}
                    {selectedJob.posted_at && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Posted</p>
                        <p className="font-bold text-gray-900 text-sm">{new Date(selectedJob.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {selectedJob.description && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">About the Role</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                </div>
              )}

              {(selectedJob.job_detail?.perks?.length > 0 || selectedJob.internship_detail?.perks?.length > 0) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Perks & Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.job_detail?.perks || selectedJob.internship_detail?.perks || []).map((perk, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#1A3C40]/5 text-[#1A3C40] text-sm rounded-full border border-[#1A3C40]/10">✓ {perk}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setSelectedJob(null)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Close
              </button>
              <button
                onClick={() => { setSelectedJob(null); navigate(`/dashboard/find-jobs/${selectedJob.id}`); }}
                className="px-6 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors"
              >
                Full Details & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantJobs;