import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  DollarSign,
  Calendar,
  ChevronLeft,
  CheckCircle,
  Share2,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const ApplicantJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Assuming API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/hirings/${id}`);
      setJob(response.data.data || response.data);
      
      // Check if already applied (This requires an endpoint or checking user applications)
      // For now, we might need to fetch applications and check ID
      checkApplicationStatus();
    } catch (error) {
      console.error('Error fetching job details:', error);
      showToast('Failed to load job details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await axios.get(`/applications`);
      const applications = response.data.data?.applications || [];
      // Assuming 'hiring_id' relates application to job
      const applied = applications.some(app =>
        String(app.hiring?.id) === String(id) || String(app.hiring_id) === String(id)
      );
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!user) return;
    try {
      setApplying(true);
      // Backend expects `hiring_detail_id` and `company_id`
      const payload = {
        hiring_detail_id: id,
        company_id: job?.company?.id || (typeof job.company === 'number' ? job.company : undefined),
      };
      await axios.post(`${API_BASE}/applications`, payload);
      showToast('Application submitted successfully!', 'success');
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying:', error);
      const msg = error.response?.data?.message || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <button
          onClick={() => navigate('/dashboard/find-jobs')}
          className="mt-4 text-[#00B8D4] hover:underline"
        >
          Back to jobs
        </button>
      </div>
    );
  }

  // Helper to safely get nested properties
  // The API structure for 'job' needs to be known. Assuming standard structure based on previous files.
  
  // Format Salary
  const getSalaryText = () => {
     // Reusing logic from Browse
      if (job.hiring_type === 'job' && job.job_detail) {
        const { min_salary, max_salary, currency, pay_per, payment_type } = job.job_detail;
        if (payment_type !== 'fixed_pay') return 'Performance Based';
        if (max_salary) return `${currency} ${min_salary?.toLocaleString()} - ${max_salary.toLocaleString()} / ${pay_per}`;
        return `${currency} ${min_salary?.toLocaleString()} / ${pay_per}`;
      } else if (job.hiring_type === 'internship' && job.internship_detail) {
        const { min_stipend, max_stipend, currency, pay_per } = job.internship_detail;
        if (max_stipend) return `${currency} ${min_stipend?.toLocaleString()} - ${max_stipend.toLocaleString()} / ${pay_per}`;
        if (min_stipend) return `${currency} ${min_stipend?.toLocaleString()} / ${pay_per}`;
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
        <ChevronLeft className="w-4 h-4" />
        Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#1A3C40]/5 flex items-center justify-center border border-[#1A3C40]/10">
                    <Building2 className="w-8 h-8 text-[#1A3C40]" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.job_title}</h1>
                  <p className="text-lg text-gray-600 font-medium">{job.company?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-50 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 border-b border-gray-100 pb-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Type</p>
                  <p className="text-sm font-semibold capitalize">{job.hiring_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                  <p className="text-sm font-semibold capitalize">{job.work_from?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Employment</p>
                  <p className="text-sm font-semibold capitalize">{job.employment_type?.replace('_', ' ')}</p>
                </div>
              </div>

               <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Salary</p>
                  <p className="text-sm font-semibold capitalize">{getSalaryText()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <div 
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            </div>
            
            {/* Responsibilities */}
             {job.responsibilities && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                  <div 
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: job.responsibilities }} 
                  />
                </div>
            )}

             {/* Requirements */}
             {job.requirements && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                  <div 
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: job.requirements }} 
                  />
                </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Interested in this role?</h3>
            
            {hasApplied ? (
               <div className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Applied
               </div>
            ) : (
                <button
                onClick={handleApply}
                disabled={applying}
                className="w-full py-3 bg-[#1A3C40] text-white rounded-lg font-bold hover:bg-[#1A3C40]/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {applying ? 'Submitting...' : 'Apply Now'}
                </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Posted on</span>
                    <span className="font-medium text-gray-900">{new Date(job.posted_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Expires on</span>
                    <span className="font-medium text-gray-900">{new Date(job.closing_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Applications</span>
                    <span className="font-medium text-gray-900">{job.application_count || 0} applicants</span>
                 </div>
            </div>
          </div>
          
           {/* Company Card */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4">About the Company</h3>
               <p className="text-sm text-gray-600 mb-4">
                   {job.company?.description || <span className="italic text-gray-400">No description available.</span>}
               </p>
               {job.company?.industry_type && (
                   <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                       <Briefcase className="w-4 h-4 flex-shrink-0" />
                       <span className="capitalize">{job.company.industry_type.replace(/_/g, ' ')}</span>
                   </div>
               )}
               {job.company?.number_of_employees && (
                   <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                       <Users className="w-4 h-4 flex-shrink-0" />
                       <span>{job.company.number_of_employees} employees</span>
                   </div>
               )}
               {job.company?.website && (
                   <a
                       href={job.company.website}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center gap-1 text-sm text-[#00B8D4] hover:underline font-medium mt-3"
                   >
                       <Globe className="w-4 h-4" />
                       Visit Website
                   </a>
               )}
               {job.company?.links && job.company.links.filter(l => l.link_type !== 'website').length > 0 && (
                   <div className="mt-3 flex flex-wrap gap-2">
                       {job.company.links.filter(l => l.link_type !== 'website').map((link, i) => (
                           <a
                               key={i}
                               href={link.url}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 capitalize"
                           >
                               {link.title || link.link_type}
                           </a>
                       ))}
                   </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantJobDetails;
