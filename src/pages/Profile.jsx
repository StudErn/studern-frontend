import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import {
  User,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Calendar,
  MapPin,
  CheckCircle,
  X,
  Lock,
  Shield,
  Award,
} from 'lucide-react';

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const emptyExpForm = {
  company_name: '',
  job_title: '',
  employment_type: 'full-time',
  location: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: false,
};

// ─── Work Experience Form Modal ─────────────────────────────────────────────
const WorkExpModal = ({ exp, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(exp ? {
    company_name: exp.company_name || '',
    job_title: exp.job_title || '',
    employment_type: exp.employment_type || 'full-time',
    location: exp.location || '',
    description: exp.description || '',
    start_date: exp.start_date ? exp.start_date.substring(0, 7) : '',
    end_date: exp.end_date ? exp.end_date.substring(0, 7) : '',
    is_current: exp.is_current || false,
  } : { ...emptyExpForm });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        start_date: form.start_date ? form.start_date + '-01' : '',
        end_date: form.is_current ? null : (form.end_date ? form.end_date + '-01' : null),
      };
      if (exp?.id) {
        await axios.put(`/work-experiences/${exp.id}`, payload);
        showToast('Experience updated', 'success');
      } else {
        await axios.post('/work-experiences', payload);
        showToast('Experience added', 'success');
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {exp ? 'Edit Experience' : 'Add Work Experience'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organisation *</label>
            <input
              type="text"
              value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })}
              placeholder="e.g. Acme Corp"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={form.job_title}
              onChange={e => setForm({ ...form, job_title: e.target.value })}
              placeholder="e.g. Frontend Developer"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select
              value={form.employment_type}
              onChange={e => setForm({ ...form, employment_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
            >
              {EMPLOYMENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="month"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="month"
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
                disabled={form.is_current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={e => setForm({ ...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date })}
              className="w-4 h-4 text-[#00B8D4] rounded border-gray-300 focus:ring-[#00B8D4]"
            />
            <span className="text-sm text-gray-700">I currently work here</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : exp ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Password Change Modal ───────────────────────────────────────────────────
const PasswordModal = ({ onClose }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/profile/change-password', form);
      showToast('Password changed successfully', 'success');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {[
            { key: 'current_password', label: 'Current Password' },
            { key: 'new_password', label: 'New Password' },
            { key: 'new_password_confirmation', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="password"
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                required
                minLength={8}
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 disabled:opacity-60">
              {saving ? 'Saving…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Format month/year label ─────────────────────────────────────────────────
const fmtMonth = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// ─── Helper: Info Row ────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</dt>
    <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
  </div>
);

// ─── Main Profile Page ───────────────────────────────────────────────────────
const Profile = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [workExps, setWorkExps] = useState([]);
  const [loadingExps, setLoadingExps] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deletingExpId, setDeletingExpId] = useState(null);

  const [editForm, setEditForm] = useState({
    firstname: '', middlename: '', lastname: '',
    username: '', date_of_birth: '', gender: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchWorkExps();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/profile');
      const raw = res.data.data || res.data;
      const userData = raw.user || raw;
      if (raw.companies && (!userData.companies || userData.companies.length === 0)) {
        userData.companies = raw.companies;
      }
      setProfile(userData);
      setEditForm({
        firstname: userData.firstname || '',
        middlename: userData.middlename || '',
        lastname: userData.lastname || '',
        username: userData.username || '',
        date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
      });
    } catch {
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkExps = async () => {
    try {
      setLoadingExps(true);
      const res = await axios.get('/work-experiences');
      const data = res.data.data;
      setWorkExps(Array.isArray(data) ? data : (data?.work_experiences || []));
    } catch {
      // silently ignore
    } finally {
      setLoadingExps(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/profile', editForm);
      showToast('Profile updated', 'success');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Remove this work experience?')) return;
    setDeletingExpId(id);
    try {
      await axios.delete(`/work-experiences/${id}`);
      showToast('Experience removed', 'success');
      fetchWorkExps();
    } catch {
      showToast('Failed to remove experience', 'error');
    } finally {
      setDeletingExpId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C40]"></div>
      </div>
    );
  }

  const fullName = [profile?.firstname, profile?.middlename, profile?.lastname].filter(Boolean).join(' ');
  const initials = ((profile?.firstname?.[0] || '') + (profile?.lastname?.[0] || '')).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#1A3C40] to-[#00B8D4]" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-[#1A3C40]">
                {initials || <User className="w-8 h-8" />}
              </div>
              <div className="flex gap-2 mb-1">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-xl hover:bg-[#1A3C40]/90 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Lock className="w-4 h-4" /> Password
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {!isEditing ? (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
                {(profile?.current_job_title || profile?.current_company_name) && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {profile.current_job_title}
                    {profile.current_job_title && profile.current_company_name ? ' · ' : ''}
                    {profile.current_company_name}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">@{profile?.username}</p>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { key: 'firstname', label: 'First Name', required: true },
                    { key: 'middlename', label: 'Middle Name' },
                    { key: 'lastname', label: 'Last Name' },
                  ].map(({ key, label, required }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="text"
                        value={editForm[key]}
                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                        required={required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editForm.date_of_birth}
                      onChange={e => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Personal Info Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#00B8D4]" /> Personal Information
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Contact" value={
              profile?.contact?.contact
                ? (
                  <span className="flex items-center gap-1.5">
                    {profile.contact.contact}
                    {profile.contact.verified && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                      </span>
                    )}
                  </span>
                )
                : 'Not set'
            } />
            <InfoRow label="Date of Birth" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'} />
            <InfoRow label="Gender" value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'} />
            <InfoRow label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'} />
          </dl>
        </div>

        {/* ── Work Experience Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#00B8D4]" /> Work Experience
            </h2>
            <button
              onClick={() => { setEditingExp(null); setShowExpModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-xl hover:bg-[#1A3C40]/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {loadingExps ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3C40]"></div>
            </div>
          ) : workExps.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No work experience added yet.</p>
              <button
                onClick={() => { setEditingExp(null); setShowExpModal(true); }}
                className="mt-3 text-[#00B8D4] text-sm font-medium hover:underline"
              >
                Add your first experience
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {workExps.map((exp, idx) => (
                <div
                  key={exp.id}
                  className={`relative pl-5 ${idx < workExps.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}
                >
                  <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 ${exp.is_current ? 'bg-[#00B8D4] border-[#00B8D4]' : 'bg-white border-gray-300'}`} />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{exp.job_title}</h3>
                        {exp.is_current && (
                          <span className="px-2 py-0.5 bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-semibold rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        {exp.company_name}
                        {exp.employment_type && (
                          <span className="text-gray-400 ml-1 capitalize">· {exp.employment_type.replace(/_/g, ' ')}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {fmtMonth(exp.start_date)} – {exp.is_current ? 'Present' : (fmtMonth(exp.end_date) || '—')}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {exp.location}
                          </span>
                        )}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{exp.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditingExp(exp); setShowExpModal(true); }}
                        className="p-1.5 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id)}
                        disabled={deletingExpId === exp.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Privileges Card ── */}
        {profile?.privileges && profile.privileges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00B8D4]" /> Privileges
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.privileges.map((p, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Companies Card ── */}
        {profile?.companies && profile.companies.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00B8D4]" /> Companies
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.companies.map((company) => (
                <div key={company.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#00B8D4]/30 transition-colors">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#1A3C40] flex items-center justify-center text-white font-bold text-sm">
                      {company.name?.[0]?.toUpperCase() || 'C'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{company.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showExpModal && (
        <WorkExpModal
          exp={editingExp}
          onClose={() => { setShowExpModal(false); setEditingExp(null); }}
          onSaved={() => { setShowExpModal(false); setEditingExp(null); fetchWorkExps(); fetchProfile(); }}
        />
      )}
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default Profile;
