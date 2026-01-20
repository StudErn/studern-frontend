import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import MapPicker from '../components/MapPicker';

const CreateCompany = () => {
  const navigate = useNavigate();
  const { createCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry_type: '',
    number_of_employees: '',
    address_lat: '',
    address_lng: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      address_lat: lat.toString(),
      address_lng: lng.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting || loading) {
      return;
    }
    
    setError('');
    setLoading(true);
    setIsSubmitting(true);

    try {
      // Clean up data
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        industry_type: formData.industry_type,
        number_of_employees: formData.number_of_employees
          ? parseInt(formData.number_of_employees)
          : undefined,
        address_lat: formData.address_lat ? parseFloat(formData.address_lat) : undefined,
        address_lng: formData.address_lng ? parseFloat(formData.address_lng) : undefined,
      };

      const result = await createCompany(payload);

      if (result.success) {
        // Small delay to ensure state is updated before navigation
        await new Promise(resolve => setTimeout(resolve, 300));
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#00B8D4] to-[#0097a7] p-8">
            <h1 className="text-3xl font-bold text-white">Create Your Company</h1>
            <p className="text-white/90 mt-2">
              Start building your team and posting opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label htmlFor="industry_type" className="block text-sm font-medium text-gray-700 mb-2">
                Industry Type *
              </label>
              <select
                id="industry_type"
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
              >
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
                placeholder="Tell us about your company..."
              />
            </div>

            <div>
              <label htmlFor="number_of_employees" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <input
                type="number"
                id="number_of_employees"
                name="number_of_employees"
                value={formData.number_of_employees}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
                placeholder="e.g., 50"
              />
            </div>

            {/* Map Picker Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Location
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Search for your address or click on the map to set your company's location
              </p>
              <MapPicker
                latitude={formData.address_lat}
                longitude={formData.address_lng}
                onLocationChange={handleLocationChange}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating...' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
