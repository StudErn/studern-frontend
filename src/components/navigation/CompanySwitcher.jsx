import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';

const CompanySwitcher = () => {
  const navigate = useNavigate();
  const { companies, selectedCompany, selectCompany } = useCompany();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectCompany = (company) => {
    selectCompany(company);
    navigate(`/company/${company.id}/overview`);
    setIsOpen(false);
  };

  const handleCreateCompany = () => {
    navigate('/company/create');
    setIsOpen(false);
  };

  if (!companies || companies.length === 0) {
    return (
      <button
        onClick={handleCreateCompany}
        className="flex items-center gap-2 px-4 py-2 bg-[#00B8D4] text-white rounded-lg hover:bg-[#0097a7] transition"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Create Company</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#00B8D4] transition"
      >
        <Building2 className="w-5 h-5 text-[#00B8D4]" />
        <div className="text-left hidden sm:block">
          <div className="text-sm font-semibold text-gray-900">
            {selectedCompany?.name || 'Select Company'}
          </div>
          {companies.length > 1 && (
            <div className="text-xs text-gray-500">
              {companies.length} companies
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Your Companies
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#0097a7] rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {company.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {company.company_industry || 'Industry not set'}
                    </div>
                  </div>
                  {selectedCompany?.id === company.id && (
                    <Check className="w-5 h-5 text-[#00B8D4] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleCreateCompany}
                className="w-full flex items-center gap-2 px-3 py-2 text-[#00B8D4] hover:bg-[#00B8D4]/10 rounded-lg transition font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create New Company
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanySwitcher;
