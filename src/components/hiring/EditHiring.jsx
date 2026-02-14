import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHiring } from '../../contexts/HiringContext';
import { useCompany } from '../../contexts/CompanyContext';

const EditHiring = () => {
  const navigate = useNavigate();
  const { id: hiringId } = useParams();
  const { selectedCompany } = useCompany();
  const { getHiringDetail, updateHiring } = useHiring();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    num_of_openings: 1,
    posted_at: '',
    closing_at: '',
    hiring_type: 'job',
    work_from: 'remote',
    employment_type: 'full-time',
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
    work_from_details: {
      work_from_type: 'remote',
      timezone: 'Asia/Dhaka',
      work_start_time: '09:00',
      work_end_time: '17:00',
      days_in_office_per_week: 3,
      only_from_office_location: false,
    },
  });

  useEffect(() => {
    const load = async () => {
      // Try to determine company id from context or localStorage
      const stored = localStorage.getItem('selectedCompany');
      const storedCompanyId = stored ? JSON.parse(stored)?.id : null;
      const companyId = selectedCompany?.id || storedCompanyId;

      if (!companyId) {
        setError('No company selected');
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await getHiringDetail(companyId, hiringId);
      if (res.success) {
        const h = res.data;
        const defaultWorkFrom = {
          work_from_type: 'remote',
          timezone: 'Asia/Dhaka',
          work_start_time: '09:00',
          work_end_time: '17:00',
          days_in_office_per_week: 3,
          only_from_office_location: false,
        };

        setFormData({
          job_title: h.job_title || '',
          description: h.description || '',
          num_of_openings: h.num_of_openings || 1,
          posted_at: h.posted_at ? h.posted_at.split('T')[0] : (h.posted_at || ''),
          closing_at: h.closing_at ? h.closing_at.split('T')[0] : (h.closing_at || ''),
          hiring_type: h.hiring_type || 'job',
          work_from: h.work_from || 'remote',
          employment_type: h.employment_type || 'full-time',
          job_details: h.job_detail || h.job_details || {
            payment_type: 'fixed_pay',
            min_salary: '',
            max_salary: '',
            currency: 'BDT',
            perks: [],
            pay_per: 'year',
            timeline: 1,
            experience_year: '',
          },
          internship_details: h.internship_detail || h.internship_details || {
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
          work_from_details: h.work_from_details || h.work_from_detail || defaultWorkFrom,
        });
      } else {
        setError(res.message || 'Failed to load posting');
      }
      setLoading(false);
    };
    load();
    // intentionally omit `getHiringDetail` from deps because the context recreates functions each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, hiringId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
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

  const addPerk = (section, perk) => {
    if (!perk || !perk.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        perks: [...(prev[section].perks || []), perk.trim()],
      },
    }));
  };

  const removePerk = (section, index) => {
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
    setErrors({});
    if (!selectedCompany) {
      setError('No company selected');
      return;
    }
    setLoading(true);
    const cleanJobDetails = {
      ...formData.job_details,
      min_salary: formData.job_details.min_salary ? parseFloat(formData.job_details.min_salary) : null,
      max_salary: formData.job_details.max_salary ? parseFloat(formData.job_details.max_salary) : null,
      experience_year: formData.job_details.experience_year ? parseInt(formData.job_details.experience_year) : null,
    };

    const cleanInternshipDetails = {
      ...formData.internship_details,
      min_stipend: formData.internship_details.min_stipend ? parseFloat(formData.internship_details.min_stipend) : null,
      max_stipend: formData.internship_details.max_stipend ? parseFloat(formData.internship_details.max_stipend) : null,
      duration_weeks: formData.internship_details.duration_weeks ? parseInt(formData.internship_details.duration_weeks) : null,
      duration_months: formData.internship_details.duration_months ? parseInt(formData.internship_details.duration_months) : null,
    };

    const cleanWorkFrom = {
      ...formData.work_from_details,
      days_in_office_per_week: formData.work_from_details.days_in_office_per_week ? parseInt(formData.work_from_details.days_in_office_per_week) : null,
      only_from_office_location: !!formData.work_from_details.only_from_office_location,
    };

    const payloadBase = {
      job_title: formData.job_title,
      description: formData.description,
      num_of_openings: Number(formData.num_of_openings),
      posted_at: formData.posted_at,
      closing_at: formData.closing_at,
      hiring_type: formData.hiring_type,
      work_from: formData.work_from,
      employment_type: formData.employment_type,
      work_from_details: cleanWorkFrom,
    };

    // Only include relevant nested details depending on hiring_type
    let payload = { ...payloadBase };
    if (formData.hiring_type === 'job') {
      payload.job_details = cleanJobDetails;
    } else if (formData.hiring_type === 'internship') {
      // remove empty start/end dates to avoid validation errors
      const intern = { ...cleanInternshipDetails };
      if (!intern.start_date_from) delete intern.start_date_from;
      if (!intern.start_date_to) delete intern.start_date_to;
      payload.internship_details = intern;
    }

    const res = await updateHiring(selectedCompany.id, hiringId, payload);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard/jobs');
    } else {
      setError(res.message || 'Failed to update posting');
      setErrors(res.errors || {});
      console.debug('Update error raw:', res.raw || res);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Posting</h1>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">{error}</p>
          {Object.keys(errors).length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm">
              {Object.entries(errors).map(([field, msgs]) => (
                <li key={field}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Position Title</label>
          <input name="job_title" value={formData.job_title} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Type</label>
            <select name="hiring_type" value={formData.hiring_type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Work Arrangement</label>
            <select name="work_from" value={formData.work_from} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employment Type</label>
            <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Openings</label>
            <input type="number" name="num_of_openings" value={formData.num_of_openings} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input type="date" name="posted_at" value={formData.posted_at} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Date</label>
            <input type="date" name="closing_at" value={formData.closing_at} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        {/* Job Details */}
        {formData.hiring_type === 'job' && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                <input type="number" value={formData.job_details.min_salary} onChange={(e) => handleNestedChange('job_details', 'min_salary', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                <input type="number" value={formData.job_details.max_salary} onChange={(e) => handleNestedChange('job_details', 'max_salary', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pay Per</label>
                <select value={formData.job_details.pay_per} onChange={(e) => handleNestedChange('job_details', 'pay_per', e.target.value)} className="w-full border px-3 py-2 rounded">
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input type="number" value={formData.job_details.experience_year} onChange={(e) => handleNestedChange('job_details', 'experience_year', e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Perks</label>
              <div className="flex gap-2 mb-2">
                <input id="jobPerkInput" placeholder="Add perk" className="flex-1 border px-3 py-2 rounded" />
                <button type="button" onClick={() => { const el = document.getElementById('jobPerkInput'); addPerk('job_details', el.value); el.value=''; }} className="px-3 py-2 bg-gray-100 rounded">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.job_details.perks || []).map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    {p}
                    <button type="button" onClick={() => removePerk('job_details', i)} className="text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Internship Details */}
        {formData.hiring_type === 'internship' && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Internship Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stipend</label>
                <input type="number" value={formData.internship_details.min_stipend} onChange={(e) => handleNestedChange('internship_details', 'min_stipend', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Stipend</label>
                <input type="number" value={formData.internship_details.max_stipend} onChange={(e) => handleNestedChange('internship_details', 'max_stipend', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (weeks)</label>
                <input type="number" value={formData.internship_details.duration_weeks} onChange={(e) => handleNestedChange('internship_details', 'duration_weeks', e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Perks</label>
              <div className="flex gap-2 mb-2">
                <input id="internPerkInput" placeholder="Add perk" className="flex-1 border px-3 py-2 rounded" />
                <button type="button" onClick={() => { const el = document.getElementById('internPerkInput'); addPerk('internship_details', el.value); el.value=''; }} className="px-3 py-2 bg-gray-100 rounded">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.internship_details.perks || []).map((p, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    {p}
                    <button type="button" onClick={() => removePerk('internship_details', i)} className="text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Work From Details */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Work From Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Start Time</label>
              <input type="time" value={formData.work_from_details.work_start_time} onChange={(e) => handleNestedChange('work_from_details', 'work_start_time', e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Work End Time</label>
              <input type="time" value={formData.work_from_details.work_end_time} onChange={(e) => handleNestedChange('work_from_details', 'work_end_time', e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Days In Office / Week</label>
              <input type="number" value={formData.work_from_details.days_in_office_per_week} onChange={(e) => handleNestedChange('work_from_details', 'days_in_office_per_week', e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-[#00B8D4] text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditHiring;
