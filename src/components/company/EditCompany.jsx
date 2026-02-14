import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import MapPicker from '../MapPicker';

const EditCompany = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { updateCompany, getCompanyUsers, fetchUserCompanies, companies } = useCompany();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      // Try to find company from context list
      let c = companies.find((x) => String(x.id) === String(companyId));
      if (!c) {
        // refresh companies and try again
        await fetchUserCompanies();
        c = companies.find((x) => String(x.id) === String(companyId));
      }

      if (c) {
        setFormData({
          name: c.name || c.company_name || '',
          description: c.description || '',
          industry_type: c.industry_type || '',
          number_of_employees: c.number_of_employees || '',
          address_lat: c.address_lat || '',
          address_lng: c.address_lng || '',
        });
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((p) => ({ ...p, address_lat: lat.toString(), address_lng: lng.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      industry_type: formData.industry_type || undefined,
      number_of_employees: formData.number_of_employees ? parseInt(formData.number_of_employees) : undefined,
      address_lat: formData.address_lat ? parseFloat(formData.address_lat) : undefined,
      address_lng: formData.address_lng ? parseFloat(formData.address_lng) : undefined,
    };

    const res = await updateCompany(companyId, payload);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Failed to update company');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Company</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Industry Type</label>
          <select name="industry_type" value={formData.industry_type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="">Select industry</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
            <input type="number" name="number_of_employees" value={formData.number_of_employees} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <MapPicker latitude={formData.address_lat} longitude={formData.address_lng} onLocationChange={handleLocationChange} />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 border-2 border-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-6 py-3 bg-[#00B8D4] text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditCompany;
