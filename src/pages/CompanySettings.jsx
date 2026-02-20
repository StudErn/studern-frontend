import React, { useState, useEffect } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { useToast } from '../contexts/ToastContext';
import MapPicker from '../components/MapPicker';
import axios from 'axios';
import {
  Building2,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Youtube,
  Facebook,
  Link as LinkIcon,
  Trash2,
  Plus,
  Save,
  Users,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const INDUSTRIES = [
  'Information Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Real Estate',
  'Media & Entertainment',
  'Logistics',
  'Legal',
  'Non-profit',
  'Government',
  'Other',
];

const LINK_TYPES = [
  { value: 'website',   label: 'Website',   icon: Globe },
  { value: 'linkedin',  label: 'LinkedIn',  icon: Linkedin },
  { value: 'twitter',   label: 'Twitter / X', icon: Twitter },
  { value: 'github',    label: 'GitHub',    icon: Github },
  { value: 'facebook',  label: 'Facebook',  icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube',   label: 'YouTube',   icon: Youtube },
  { value: 'other',     label: 'Other',     icon: LinkIcon },
];

const getLinkIcon = (type) => {
  const found = LINK_TYPES.find((t) => t.value === type);
  if (!found) return LinkIcon;
  return found.icon;
};

const inputCls = (error) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 outline-none transition-all ${
    error
      ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-400'
      : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#00B8D4] focus:border-[#00B8D4]'
  }`;

const CompanySettings = () => {
  const { selectedCompany, updateCompany } = useCompany();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loadingCompany, setLoadingCompany] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    description: '',
    industry_type: '',
    number_of_employees: '',
    address_lat: '',
    address_lng: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Links
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ link_type: 'website', title: '', url: '' });
  const [linkErrors, setLinkErrors] = useState({});
  const [addingLink, setAddingLink] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState(null);

  // Fetch fresh company data (including links)
  useEffect(() => {
    if (!selectedCompany?.id) return;
    const fetch = async () => {
      setLoadingCompany(true);
      try {
        const res = await axios.get(`/companies/${selectedCompany.id}`);
        const c = res.data?.data || {};
        setProfileForm({
          name:                c.name || '',
          description:         c.description || '',
          industry_type:       c.industry_type || '',
          number_of_employees: c.number_of_employees || '',
          address_lat:         c.address_lat || '',
          address_lng:         c.address_lng || '',
        });
        setLinks(c.links || []);
      } catch {
        // Fall back to context data
        const c = selectedCompany;
        setProfileForm({
          name:                c.name || '',
          description:         c.description || '',
          industry_type:       c.industry_type || '',
          number_of_employees: c.number_of_employees || '',
          address_lat:         c.address_lat || '',
          address_lng:         c.address_lng || '',
        });
        setLinks(c.links || []);
      } finally {
        setLoadingCompany(false);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((p) => ({ ...p, [name]: value }));
    if (profileErrors[name]) setProfileErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleLocationChange = (lat, lng) => {
    setProfileForm((p) => ({ ...p, address_lat: String(lat), address_lng: String(lng) }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setSavingProfile(true);
    const payload = {
      name:                profileForm.name,
      description:         profileForm.description || null,
      industry_type:       profileForm.industry_type || null,
      number_of_employees: profileForm.number_of_employees ? parseInt(profileForm.number_of_employees) : null,
      address_lat:         profileForm.address_lat ? parseFloat(profileForm.address_lat) : null,
      address_lng:         profileForm.address_lng ? parseFloat(profileForm.address_lng) : null,
    };
    const res = await updateCompany(selectedCompany.id, payload);
    setSavingProfile(false);
    if (res.success) {
      showToast('Company profile updated successfully!', 'success');
    } else {
      if (res.errors && Object.keys(res.errors).length > 0) setProfileErrors(res.errors);
      showToast(res.message || 'Failed to update company.', 'error');
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    setLinkErrors({});
    const errs = {};
    if (!newLink.title.trim()) errs.title = 'Title is required';
    if (!newLink.url.trim()) errs.url = 'URL is required';
    if (Object.keys(errs).length) { setLinkErrors(errs); return; }

    setAddingLink(true);
    try {
      const res = await axios.post(`/companies/${selectedCompany.id}/links`, newLink);
      const added = res.data?.data;
      setLinks((prev) => [...prev, added]);
      setNewLink({ link_type: 'website', title: '', url: '' });
      showToast('Link added!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add link';
      const serverErrors = err.response?.data?.messages || err.response?.data?.errors || {};
      setLinkErrors(serverErrors);
      showToast(msg, 'error');
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    setDeletingLinkId(linkId);
    try {
      await axios.delete(`/companies/${selectedCompany.id}/links/${linkId}`);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      showToast('Link removed.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove link', 'error');
    } finally {
      setDeletingLinkId(null);
    }
  };

  // ─── No company selected ───────────────────────────────────────────────────
  if (!selectedCompany) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">No Company Selected</h2>
          <p className="text-sm text-gray-500 mt-1">Please select or create a company to manage its settings.</p>
        </div>
      </div>
    );
  }

  const initials = (selectedCompany.name || '?').slice(0, 2).toUpperCase();

  const TABS = [
    { key: 'profile', label: 'Profile',  icon: Info },
    { key: 'links',   label: 'Links',    icon: Globe },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1A3C40] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{selectedCompany.name}</p>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === key
                ? 'border-[#00B8D4] text-[#00B8D4]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {loadingCompany ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#00B8D4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Profile Tab ─────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="e.g. Acme Corp"
                  className={inputCls(profileErrors.name)}
                />
                {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
                <select
                  name="industry_type"
                  value={profileForm.industry_type}
                  onChange={handleProfileChange}
                  className={inputCls(profileErrors.industry_type)}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
                {profileErrors.industry_type && <p className="text-red-500 text-xs mt-1">{profileErrors.industry_type}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About the Company</label>
                <textarea
                  name="description"
                  value={profileForm.description}
                  onChange={handleProfileChange}
                  rows={5}
                  placeholder="Tell candidates what makes your company a great place to work…"
                  className={inputCls(profileErrors.description) + ' resize-none'}
                />
                {profileErrors.description && <p className="text-red-500 text-xs mt-1">{profileErrors.description}</p>}
              </div>

              {/* Number of Employees */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                  <Users className="w-4 h-4 text-gray-400" /> Number of Employees
                </label>
                <input
                  type="number"
                  name="number_of_employees"
                  value={profileForm.number_of_employees}
                  onChange={handleProfileChange}
                  min="1"
                  placeholder="e.g. 150"
                  className={inputCls(profileErrors.number_of_employees)}
                />
                {profileErrors.number_of_employees && (
                  <p className="text-red-500 text-xs mt-1">{profileErrors.number_of_employees}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Location</label>
                <MapPicker
                  latitude={profileForm.address_lat}
                  longitude={profileForm.address_lng}
                  onLocationChange={handleLocationChange}
                />
                {(profileErrors.address_lat || profileErrors.address_lng) && (
                  <p className="text-red-500 text-xs mt-1">{profileErrors.address_lat || profileErrors.address_lng}</p>
                )}
              </div>

              {/* Save */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-3 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* ── Links Tab ────────────────────────────────────────────────── */}
          {activeTab === 'links' && (
            <div className="space-y-4">

              {/* Existing links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800">Company Links</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Links visible on your company profile</p>
                </div>

                {links.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">
                    No links added yet. Add your website, social profiles, etc. below.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {links.map((link) => {
                      const Icon = getLinkIcon(link.link_type);
                      return (
                        <li key={link.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{link.title}</p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00B8D4] hover:underline flex items-center gap-1 mt-0.5 truncate"
                            >
                              {link.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={deletingLinkId === link.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Add new link */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#00B8D4]" /> Add New Link
                </h3>
                <form onSubmit={handleAddLink} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Link Type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select
                        value={newLink.link_type}
                        onChange={(e) => setNewLink((p) => ({ ...p, link_type: e.target.value }))}
                        className={inputCls(false)}
                      >
                        {LINK_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Display Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newLink.title}
                        onChange={(e) => {
                          setNewLink((p) => ({ ...p, title: e.target.value }));
                          if (linkErrors.title) setLinkErrors((p) => ({ ...p, title: '' }));
                        }}
                        placeholder="e.g. Company Website"
                        className={inputCls(linkErrors.title)}
                      />
                      {linkErrors.title && <p className="text-red-500 text-xs mt-1">{linkErrors.title}</p>}
                    </div>
                  </div>
                  {/* URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => {
                        setNewLink((p) => ({ ...p, url: e.target.value }));
                        if (linkErrors.url) setLinkErrors((p) => ({ ...p, url: '' }));
                      }}
                      placeholder="https://yourcompany.com"
                      className={inputCls(linkErrors.url)}
                    />
                    {linkErrors.url && <p className="text-red-500 text-xs mt-1">{linkErrors.url}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={addingLink}
                    className="w-full py-2.5 bg-[#00B8D4] text-white rounded-xl text-sm font-bold hover:bg-[#00B8D4]/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {addingLink ? 'Adding…' : 'Add Link'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanySettings;
