import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { useToast } from '../../contexts/ToastContext';
import MapPicker from '../MapPicker';

const INDUSTRIES = [
  'Information Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Other',
];

const EditCompany = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { updateCompany, fetchUserCompanies } = useCompany();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry_type: '',
    number_of_employees: '',
    address_lat: '',
    address_lng: '',
  });

  useEffect(() => {
    const load = async () => {
      const list = await fetchUserCompanies();
      const c = (list || []).find((x) => String(x.id) === String(companyId));

      if (c) {
        setFormData({
          name:                c.name || c.company_name || '',
          description:         c.description || '',
          industry_type:       c.industry_type || '',
          number_of_employees: c.number_of_employees || '',
          address_lat:         c.address_lat || '',
          address_lng:         c.address_lng || '',
        });
      } else {
        toast.error('Company not found or you do not have access.');
        navigate('/dashboard', { replace: true });
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((p) => ({ ...p, address_lat: lat.toString(), address_lng: lng.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSaving(true);

    const payload = {
      name:                formData.name,
      description:         formData.description || null,
      industry_type:       formData.industry_type || null,
      number_of_employees: formData.number_of_employees ? parseInt(formData.number_of_employees) : null,
      address_lat:         formData.address_lat ? parseFloat(formData.address_lat) : null,
      address_lng:         formData.address_lng ? parseFloat(formData.address_lng) : null,
    };

    const res = await updateCompany(companyId, payload);
    setSaving(false);

    if (res.success) {
      toast.success('Company profile updated successfully!');
      navigate(-1);
    } else {
      if (res.errors && Object.keys(res.errors).length > 0) {
        setFieldErrors(res.errors);
      }
      toast.error(res.message || 'Failed to update company.');
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 outline-none transition-all font-medium ${
      fieldErrors[field]
        ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400'
        : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#00B8D4]'
    }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#00B8D4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Company Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your company's public information.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Acme Corp"
            className={inputClass('name')}
          />
          {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Industry Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
          <select
            name="industry_type"
            value={formData.industry_type}
            onChange={handleChange}
            className={inputClass('industry_type')}
          >
            <option value="">Select industryâ€¦</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          {fieldErrors.industry_type && <p className="text-red-500 text-xs mt-1">{fieldErrors.industry_type}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell candidates about your companyâ€¦"
            className={inputClass('description')}
          />
          {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Employees</label>
          <input
            type="number"
            name="number_of_employees"
            value={formData.number_of_employees}
            onChange={handleChange}
            min="1"
            placeholder="e.g. 150"
            className={inputClass('number_of_employees')}
          />
          {fieldErrors.number_of_employees && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.number_of_employees}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Office Location</label>
          <MapPicker
            latitude={formData.address_lat}
            longitude={formData.address_lng}
            onLocationChange={handleLocationChange}
          />
          {(fieldErrors.address_lat || fieldErrors.address_lng) && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.address_lat || fieldErrors.address_lng}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-[#1A3C40] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#1A3C40]/20 disabled:opacity-50"
          >
            {saving ? 'Savingâ€¦' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompany;
