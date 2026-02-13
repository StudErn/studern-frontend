import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useHiring } from '../../contexts/HiringContext';
import { useCompany } from '../../contexts/CompanyContext';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  ArrowLeft,
  Building2,
  AlertCircle,
} from 'lucide-react';

const CreateHiring = () => {
  const navigate = useNavigate();
  const { companyId: companyIdParam } = useParams();
  const { selectedCompany, companies, companyPrivileges, fetchUserCompanies, selectCompany } = useCompany();
  const { createHiring, checkIfFreePosting } = useHiring();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isFree, setIsFree] = useState(true);
  const [paymentPackages, setPaymentPackages] = useState([]);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasPostJobPrivilege, setHasPostJobPrivilege] = useState(false);

  // Use companyId from URL params or fall back to selectedCompany
  const companyId = companyIdParam || selectedCompany?.id;

  // Check if user has companies and posting privileges
  useEffect(() => {
    const checkAccess = async () => {
      setCheckingAccess(true);
      const fetched = await fetchUserCompanies();

      // If URL includes companyId param, try to auto-select that company
      if (companyIdParam && fetched && fetched.length > 0) {
        const found = fetched.find(c => String(c.id) === String(companyIdParam));
        if (found) selectCompany(found);
      }

      setCheckingAccess(false);
    };
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if user has post job privilege for selected company
  useEffect(() => {
    if (companyPrivileges && companyPrivileges.length > 0) {
      const canPost = companyPrivileges.some(
        (priv) => priv.permission_name === 'can_post_jobs' && priv.is_granted
      );
      setHasPostJobPrivilege(canPost);
    } else {
      setHasPostJobPrivilege(false);
    }
  }, [companyPrivileges]);

  useEffect(() => {
    const checkFree = async () => {
      if (companyId) {
        const result = await checkIfFreePosting(companyId);
        if (result.success) {
          setIsFree(result.isFree);
        }
      }
    };
    checkFree();
  }, [companyId, checkIfFreePosting]);

  const [formData, setFormData] = useState({
    job_title: '',
    hiring_type: 'job',
    work_from: 'remote',
    employment_type: 'full-time',
    num_of_openings: 1,
    description: '',
    posted_at: '',
    closing_at: '',
    // Job details
    job_details: {
      payment_type: 'fixed_pay',
      min_salary: '',
      max_salary: '',
      currency: 'BDT',
      perks: [],
      pay_per: 'year',
      timeline: 1,
      experience_year: '',
    },
    // Internship details
    internship_details: {
      min_stipend: '',
      max_stipend: '',
      currency: 'BDT',
      pay_per: 'month',
      duration_weeks: '',
      duration_months: '',
      perks: [],
      when_to_start: 'immediate',
      start_date_from: '',
      start_date_to: '',
    },
    // Work from details
    work_from_details: {
      work_from_type: 'remote',
      timezone: 'Asia/Dhaka',
      work_start_time: '09:00',
      work_end_time: '17:00',
      days_in_office_per_week: 3,
      only_from_office_location: false,
    },
    // Payment
    payment_package: '',
  });

  const [perkInput, setPerkInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Sync work_from with work_from_details
    if (name === 'work_from') {
      setFormData((prev) => ({
        ...prev,
        work_from_details: {
          ...prev.work_from_details,
          work_from_type: value,
        },
      }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const addPerk = () => {
    if (!perkInput.trim()) return;
    const section =
      formData.hiring_type === 'job' ? 'job_details' : 'internship_details';
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        perks: [...prev[section].perks, perkInput.trim()],
      },
    }));
    setPerkInput('');
  };

  const removePerk = (index) => {
    const section =
      formData.hiring_type === 'job' ? 'job_details' : 'internship_details';
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        perks: prev[section].perks.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Submitting job posting', { companyId, formData });

    // Build payload based on hiring type
    const payload = {
      company_id: parseInt(companyId),
      job_title: formData.job_title,
      hiring_type: formData.hiring_type,
      work_from: formData.work_from,
      employment_type: formData.employment_type,
      num_of_openings: parseInt(formData.num_of_openings),
      description: formData.description,
      posted_at: formData.posted_at,
      closing_at: formData.closing_at,
      work_from_details: formData.work_from_details,
    };

    if (formData.hiring_type === 'job') {
      payload.job_details = {
        ...formData.job_details,
        min_salary: formData.job_details.min_salary
          ? parseFloat(formData.job_details.min_salary)
          : null,
        max_salary: formData.job_details.max_salary
          ? parseFloat(formData.job_details.max_salary)
          : null,
        experience_year: formData.job_details.experience_year
          ? parseInt(formData.job_details.experience_year)
          : null,
      };
    } else {
      payload.internship_details = {
        ...formData.internship_details,
        min_stipend: formData.internship_details.min_stipend
          ? parseFloat(formData.internship_details.min_stipend)
          : null,
        max_stipend: formData.internship_details.max_stipend
          ? parseFloat(formData.internship_details.max_stipend)
          : null,
        duration_weeks: formData.internship_details.duration_weeks
          ? parseInt(formData.internship_details.duration_weeks)
          : null,
        duration_months: formData.internship_details.duration_months
          ? parseInt(formData.internship_details.duration_months)
          : null,
      };
    }

    console.log('Payload built', payload);
    if (!isFree && formData.payment_package) {
      payload.payment_package = formData.payment_package;
    }
    const result = await createHiring(companyId, payload);
    console.log('API result', result);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard/jobs');
    } else {
      setError(result.message);
      setErrors(result.errors || {});
    }
  };

  const currentPerks =
    formData.hiring_type === 'job'
      ? formData.job_details.perks
      : formData.internship_details.perks;

  // Show loading state while checking access
  if (checkingAccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D4] mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Show message if user has no companies
  if (!companies || companies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create a company or be part of a company to post jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-company"
                className="px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Create Company
              </Link>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no company is selected
  if (!companyId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Company</h2>
            <p className="text-gray-600 mb-6">
              Please select a company to post a job. You can also create a new company if needed.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Companies</label>
              <div className="space-y-2">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      selectCompany(company);
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#00B8D4] hover:bg-[#00B8D4]/5 transition text-left"
                  >
                    <p className="font-semibold text-gray-900">{company.name || company.company_name || company.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-company"
                className="px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Create New Company
              </Link>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user doesn't have post job privilege
  if (!hasPostJobPrivilege && companyPrivileges.length > 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to post jobs for this company. Please contact your company administrator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-company"
                className="px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Create Your Own Company
              </Link>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Postings
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#00B8D4] to-[#0097a7] p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Create New Posting
          </h1>
          <p className="text-white/90 mt-2">
            Fill in the details for your job or internship posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">{error}</p>
              {Object.keys(errors).length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, messages]) => (
                    <li key={field} className="text-sm">
                      {Array.isArray(messages) ? messages[0] : messages}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Step 1: Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Type *
                </label>
                <select
                  name="hiring_type"
                  value={formData.hiring_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                >
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Arrangement *
                </label>
                <select
                  name="work_from"
                  value={formData.work_from}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings *
                </label>
                <input
                  type="number"
                  name="num_of_openings"
                  value={formData.num_of_openings}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                placeholder="Describe the role, responsibilities, requirements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Date *
                </label>
                <input
                  type="datetime-local"
                  name="posted_at"
                  value={formData.posted_at}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Date *
                </label>
                <input
                  type="datetime-local"
                  name="closing_at"
                  value={formData.closing_at}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Compensation Details */}
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.hiring_type === 'job' ? 'Compensation' : 'Stipend'} Details
            </h2>

            {formData.hiring_type === 'job' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Salary
                    </label>
                    <input
                      type="number"
                      value={formData.job_details.min_salary}
                      onChange={(e) =>
                        handleNestedChange('job_details', 'min_salary', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="80000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      value={formData.job_details.max_salary}
                      onChange={(e) =>
                        handleNestedChange('job_details', 'max_salary', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="120000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.job_details.currency}
                      onChange={(e) =>
                        handleNestedChange('job_details', 'currency', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                    >
                      <option value="BDT">BDT</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Period
                    </label>
                    <select
                      value={formData.job_details.pay_per}
                      onChange={(e) =>
                        handleNestedChange('job_details', 'pay_per', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                    >
                      <option value="hour">Per Hour</option>
                      <option value="day">Per Day</option>
                      <option value="week">Per Week</option>
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required (years)
                    </label>
                    <input
                      type="number"
                      value={formData.job_details.experience_year}
                      onChange={(e) =>
                        handleNestedChange('job_details', 'experience_year', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Stipend
                    </label>
                    <input
                      type="number"
                      value={formData.internship_details.min_stipend}
                      onChange={(e) =>
                        handleNestedChange(
                          'internship_details',
                          'min_stipend',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Stipend
                    </label>
                    <input
                      type="number"
                      value={formData.internship_details.max_stipend}
                      onChange={(e) =>
                        handleNestedChange(
                          'internship_details',
                          'max_stipend',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="8000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pay Period
                    </label>
                    <select
                      value={formData.internship_details.pay_per}
                      onChange={(e) =>
                        handleNestedChange('internship_details', 'pay_per', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                    >
                      <option value="week">Per Week</option>
                      <option value="month">Per Month</option>
                      <option value="lump-sum">Lump Sum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Months)
                    </label>
                    <input
                      type="number"
                      value={formData.internship_details.duration_months}
                      onChange={(e) =>
                        handleNestedChange(
                          'internship_details',
                          'duration_months',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Preference
                    </label>
                    <select
                      value={formData.internship_details.when_to_start}
                      onChange={(e) =>
                        handleNestedChange(
                          'internship_details',
                          'when_to_start',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                    >
                      <option value="immediate">Immediate (within 30 days)</option>
                      <option value="specific_range">Specific Date Range</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Perks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perks & Benefits
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={perkInput}
                  onChange={(e) => setPerkInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerk())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  placeholder="Add a perk..."
                />
                <button
                  type="button"
                  onClick={addPerk}
                  className="px-6 py-3 bg-[#00B8D4] text-white rounded-lg hover:bg-[#0097a7] transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentPerks.map((perk, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {perk}
                    <button
                      type="button"
                      onClick={() => removePerk(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Arrangement Details */}
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900">Work Arrangement</h2>

            {formData.work_from === 'remote' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.work_from_details.timezone}
                    onChange={(e) =>
                      handleNestedChange('work_from_details', 'timezone', e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.work_from_details.work_start_time}
                    onChange={(e) =>
                      handleNestedChange(
                        'work_from_details',
                        'work_start_time',
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work End Time
                  </label>
                  <input
                    type="time"
                    value={formData.work_from_details.work_end_time}
                    onChange={(e) =>
                      handleNestedChange(
                        'work_from_details',
                        'work_end_time',
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {formData.work_from === 'hybrid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days in Office Per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.work_from_details.days_in_office_per_week}
                    onChange={(e) =>
                      handleNestedChange(
                        'work_from_details',
                        'days_in_office_per_week',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.work_from_details.only_from_office_location}
                      onChange={(e) =>
                        handleNestedChange(
                          'work_from_details',
                          'only_from_office_location',
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 text-[#00B8D4] focus:ring-[#00B8D4] rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Must work from office location
                    </span>
                  </label>
                </div>
              </div>
            )}

            {formData.work_from === 'onsite' && (
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.work_from_details.only_from_office_location}
                    onChange={(e) =>
                      handleNestedChange(
                        'work_from_details',
                        'only_from_office_location',
                        e.target.checked
                      )
                    }
                    className="w-5 h-5 text-[#00B8D4] focus:ring-[#00B8D4] rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Must work from office location only
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Payment Details */}
          {!isFree && (
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Package</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Package *
                </label>
                <select
                  value={formData.payment_package}
                  onChange={handleChange}
                  name="payment_package"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent"
                >
                  <option value="">Select a package</option>
                  <option value="Basic">Basic - ৳3,850 (Job will be shown in basic form)</option>
                  <option value="Standard">Standard - ৳4,500 (Enhanced visibility with better placement)</option>
                  <option value="Premium">Premium - ৳5,300 (Top placement for 3 days)</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard/jobs')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHiring;
