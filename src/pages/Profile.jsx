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
  FolderKanban,
  Link as LinkIcon,
  Tag,
  Star,
  AlertTriangle,
  Mail,
  Phone,
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

// ─── Project Form Modal ─────────────────────────────────────────────────────
const emptyProjectForm = {
  title: '',
  description: '',
  url: '',
  image_url: '',
  tags: '',
  start_date: '',
  end_date: '',
  is_ongoing: false,
};

const ProjectModal = ({ project, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(project ? {
    title: project.title || '',
    description: project.description || '',
    url: project.url || '',
    image_url: project.image_url || '',
    tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
    start_date: project.start_date ? project.start_date.substring(0, 7) : '',
    end_date: project.end_date ? project.end_date.substring(0, 7) : '',
    is_ongoing: project.is_ongoing || false,
  } : { ...emptyProjectForm });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        start_date: form.start_date ? form.start_date + '-01' : null,
        end_date: form.is_ongoing ? null : (form.end_date ? form.end_date + '-01' : null),
      };
      if (project?.id) {
        await axios.put(`/projects/${project.id}`, payload);
        showToast('Project updated', 'success');
      } else {
        await axios.post('/projects', payload);
        showToast('Project added', 'success');
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {project ? 'Edit Project' : 'Add Project'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. StudErn – Job Platform" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="What did you build and what was your role?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
            <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://github.com/you/project"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags / Technologies</label>
            <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="React, Laravel, Tailwind (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="month" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="month" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                disabled={form.is_ongoing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_ongoing}
              onChange={e => setForm({ ...form, is_ongoing: e.target.checked, end_date: e.target.checked ? '' : form.end_date })}
              className="w-4 h-4 text-[#00B8D4] rounded border-gray-300 focus:ring-[#00B8D4]" />
            <span className="text-sm text-gray-700">Currently working on this</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Achievement Form Modal ──────────────────────────────────────────────────
const emptyAchievementForm = {
  title: '',
  description: '',
  issuer: '',
  date: '',
  url: '',
};

const AchievementModal = ({ achievement, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(achievement ? {
    title: achievement.title || '',
    description: achievement.description || '',
    issuer: achievement.issuer || '',
    date: achievement.date ? achievement.date.substring(0, 7) : '',
    url: achievement.url || '',
  } : { ...emptyAchievementForm });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: form.date ? form.date + '-01' : null,
      };
      if (achievement?.id) {
        await axios.put(`/achievements/${achievement.id}`, payload);
        showToast('Achievement updated', 'success');
      } else {
        await axios.post('/achievements', payload);
        showToast('Achievement added', 'success');
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save achievement', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">
            {achievement ? 'Edit Achievement' : 'Add Achievement'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Best Developer Award" required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuer / Organisation</label>
            <input type="text" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })}
              placeholder="e.g. GitHub, Google, University"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Awarded</label>
            <input type="month" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate / Proof URL</label>
            <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://certificate.example.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Briefly describe this achievement…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : achievement ? 'Save Changes' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Account Confirmation Modal ──────────────────────────────────────
const DeleteAccountModal = ({ onClose }) => {
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await axios.delete('/profile/delete-account', { data: { password } });
      showToast('Account deleted. Goodbye!', 'success');
      logout();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Account</h3>
              <p className="text-xs text-gray-500">This action is permanent and cannot be undone.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            All your profile data, applications, work experiences, projects, and achievements will be permanently removed.
            Enter your password to confirm.
          </p>
          <form onSubmit={handleDelete} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Your current password"
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Keep Account</button>
              <button type="submit" disabled={deleting || !password}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete Forever'}
              </button>
            </div>
          </form>
        </div>
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
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deletingExpId, setDeletingExpId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [deletingAchievementId, setDeletingAchievementId] = useState(null);

  // Contact management
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactValue, setNewContactValue] = useState('');
  const [contactStep, setContactStep] = useState(1); // 1=enter contact, 2=enter OTP
  const [contactForOtp, setContactForOtp] = useState(''); // existing unverified contact being verified
  const [otpValue, setOtpValue] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown timer for resend rate-limit
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const [editForm, setEditForm] = useState({
    firstname: '', middlename: '', lastname: '',
    username: '', date_of_birth: '', gender: '',
    current_job_title: '', current_company_name: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchWorkExps();
    fetchProjects();
    fetchAchievements();
    fetchContacts();
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
      // Normalize company and current company fields so the UI can display them reliably
      const companies = (userData.companies || []).map(c => ({
        ...c,
        name: c.name || c.company_name || c.companyName || c.company || '',
        role: c.role || (c.pivot && c.pivot.role) || c.company_role || '',
      }));

      const normalized = {
        ...userData,
        companies,
        current_company_name: userData.current_company_name || userData.current_company || userData.company_name || userData.companyName || (companies[0] && companies[0].name) || null,
        current_job_title: userData.current_job_title || userData.current_job || userData.job_title || null,
      };

      setProfile(normalized);
      // Seed contacts from profile as initial data (will be refreshed by fetchContacts)
      if (normalized.contacts && normalized.contacts.length > 0) {
        setContacts(normalized.contacts);
      }
      // Use normalized data for edit form as well
      setEditForm({
        firstname: normalized.firstname || '',
        middlename: normalized.middlename || '',
        lastname: normalized.lastname || '',
        username: normalized.username || '',
        date_of_birth: normalized.date_of_birth ? new Date(normalized.date_of_birth).toISOString().split('T')[0] : '',
        gender: normalized.gender || '',
        current_job_title: normalized.current_job_title || '',
        current_company_name: normalized.current_company_name || '',
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

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await axios.get('/projects');
      const data = res.data.data;
      setProjects(Array.isArray(data) ? data : (data?.projects || []));
    } catch {
      // silently ignore
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      setLoadingAchievements(true);
      const res = await axios.get('/achievements');
      const data = res.data.data;
      setAchievements(Array.isArray(data) ? data : (data?.achievements || []));
    } catch {
      // silently ignore
    } finally {
      setLoadingAchievements(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await axios.get('/profile/contacts');
      const data = res.data.data;
      setContacts(Array.isArray(data) ? data : (data?.contacts || []));
    } catch {
      // silently ignore
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContactValue.trim()) return;
    setContactSubmitting(true);
    try {
      await axios.post('/profile/contacts', { contact: newContactValue.trim() });
      showToast('Verification code sent!', 'success');
      setContactStep(2);
      setResendCountdown(60);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add contact', 'error');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) return;
    const targetContact = contactForOtp || newContactValue;
    setContactSubmitting(true);
    try {
      await axios.post('/contact-verification', { contact: targetContact, token: otpValue });
      showToast('Contact verified successfully!', 'success');
      cancelVerify();
      fetchContacts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid or expired code', 'error');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleResendOTP = async (contact) => {
    setContactSubmitting(true);
    try {
      await axios.post('/profile/contacts/resend', { contact });
      showToast('Verification code resent!', 'success');
      setResendCountdown(60);
    } catch (err) {
      const retryAfter = err.response?.data?.data?.retry_after_seconds;
      if (retryAfter) {
        setResendCountdown(Math.ceil(retryAfter));
        showToast(`Please wait ${Math.ceil(retryAfter)}s before resending`, 'warning');
      } else {
        showToast(err.response?.data?.message || 'Failed to resend code', 'error');
      }
    } finally {
      setContactSubmitting(false);
    }
  };

  const startVerifyExisting = (contact) => {
    setContactForOtp(contact);
    setOtpValue('');
    setShowAddContact(false);
    setContactStep(1);
    setResendCountdown(0);
  };

  const cancelVerify = () => {
    setShowAddContact(false);
    setContactForOtp('');
    setOtpValue('');
    setContactStep(1);
    setNewContactValue('');
    setResendCountdown(0);
  };

  const handleRemoveContact = async (contact) => {
    if (!window.confirm(`Remove "${contact}" from your contacts?`)) return;
    try {
      await axios.delete('/profile/contacts', { data: { contact } });
      showToast('Contact removed', 'success');
      fetchContacts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove contact', 'error');
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

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Remove this project?')) return;
    setDeletingProjectId(id);
    try {
      await axios.delete(`/projects/${id}`);
      showToast('Project removed', 'success');
      fetchProjects();
    } catch {
      showToast('Failed to remove project', 'error');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!window.confirm('Remove this achievement?')) return;
    setDeletingAchievementId(id);
    try {
      await axios.delete(`/achievements/${id}`);
      showToast('Achievement removed', 'success');
      fetchAchievements();
    } catch {
      showToast('Failed to remove achievement', 'error');
    } finally {
      setDeletingAchievementId(null);
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
                {(profile?.current_job_title || profile?.current_company_name || (profile?.companies && profile.companies.length > 0)) && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {profile.current_job_title || (profile.companies && profile.companies[0]?.role) || ''}
                    {(profile.current_job_title || (profile.companies && profile.companies[0]?.role)) && (profile.current_company_name || (profile.companies && profile.companies[0]?.name)) ? ' · ' : ''}
                    {profile.current_company_name || (profile.companies && profile.companies[0]?.name) || ''}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                    <input
                      type="text"
                      value={editForm.current_job_title}
                      onChange={e => setEditForm({ ...editForm, current_job_title: e.target.value })}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company / Institution</label>
                    <input
                      type="text"
                      value={editForm.current_company_name}
                      onChange={e => setEditForm({ ...editForm, current_company_name: e.target.value })}
                      placeholder="e.g. Google"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4]"
                    />
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
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-[#00B8D4]" /> Personal Information
          </h2>

          {/* ── Contacts sub-section ── */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email / Phone Contacts
              </p>
              {!showAddContact && !contactForOtp && (
                <button
                  onClick={() => { setShowAddContact(true); setContactStep(1); setNewContactValue(''); setOtpValue(''); setContactForOtp(''); }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#00B8D4] hover:text-[#1A3C40] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add contact
                </button>
              )}
            </div>

            {loadingContacts ? (
              <div className="flex items-center gap-2 py-3 text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1A3C40]" />
                Loading…
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-gray-400 py-1 italic">No contacts added yet.</p>
            ) : (
              <div className="space-y-2">
                {contacts.map(c => (
                  <div key={c.contact} className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 group">
                    <div className="flex items-center gap-2 min-w-0">
                      {c.contact_type === 'email'
                        ? <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        : <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      }
                      <span className="text-sm text-gray-800 font-medium truncate">{c.contact}</span>
                      {c.verified ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap flex-shrink-0">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700 whitespace-nowrap flex-shrink-0">
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {!c.verified && (
                        <>
                          <button
                            onClick={() => startVerifyExisting(c.contact)}
                            className="px-2 py-1 rounded-lg text-[#00B8D4] font-semibold hover:bg-[#00B8D4]/10 transition-colors"
                          >
                            Verify
                          </button>
                          <span className="text-gray-200">|</span>
                          <button
                            onClick={() => handleResendOTP(c.contact)}
                            className="px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            Resend
                          </button>
                          <span className="text-gray-200">|</span>
                        </>
                      )}
                      <button
                        onClick={() => handleRemoveContact(c.contact)}
                        className="px-2 py-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Enter new contact */}
            {showAddContact && contactStep === 1 && (
              <div className="mt-3 p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <p className="text-xs font-semibold text-gray-700 mb-2.5 flex items-center gap-1">
                  <Plus className="w-3 h-3 text-[#00B8D4]" /> Add Email or Phone Number
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newContactValue}
                    onChange={e => setNewContactValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddContact()}
                    placeholder="email@example.com or +88017XXXXXXXX"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    disabled={contactSubmitting}
                    autoFocus
                  />
                  <button
                    onClick={handleAddContact}
                    disabled={contactSubmitting || !newContactValue.trim()}
                    className="px-4 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-lg hover:bg-[#1A3C40]/90 disabled:opacity-60 whitespace-nowrap transition-colors"
                  >
                    {contactSubmitting
                      ? <span className="flex items-center gap-1.5"><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> Sending…</span>
                      : 'Send Code'}
                  </button>
                  <button
                    onClick={() => setShowAddContact(false)}
                    className="p-2 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 / Verify existing unverified contact: Enter OTP */}
            {((showAddContact && contactStep === 2) || (contactForOtp && !showAddContact)) && (
              <div className="mt-3 p-4 rounded-xl bg-green-50/70 border border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Enter Verification Code
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      A 6-digit code was sent to{' '}
                      <strong className="text-gray-700">{contactForOtp || newContactValue}</strong>
                    </p>
                  </div>
                  <button onClick={cancelVerify} className="p-0.5 text-gray-300 hover:text-gray-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                    placeholder="••••••"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    disabled={contactSubmitting}
                    autoFocus
                  />
                  <button
                    onClick={handleVerifyOTP}
                    disabled={contactSubmitting || otpValue.length !== 6}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                  >
                    {contactSubmitting
                      ? <span className="flex items-center gap-1.5"><div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> Verifying…</span>
                      : 'Verify'}
                  </button>
                  {resendCountdown > 0 ? (
                    <span className="text-xs text-gray-400">Resend in {resendCountdown}s</span>
                  ) : (
                    <button
                      onClick={() => handleResendOTP(contactForOtp || newContactValue)}
                      disabled={contactSubmitting}
                      className="text-xs text-[#00B8D4] hover:underline font-medium disabled:opacity-60 transition-colors"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoRow label="Date of Birth" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'} />
              <InfoRow label="Gender" value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'} />
              <InfoRow label="Member Since" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'} />
            </dl>
          </div>
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

        {/* ── Projects Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#00B8D4]" /> Projects
            </h2>
            <button
              onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-xl hover:bg-[#1A3C40]/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {loadingProjects ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3C40]"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FolderKanban className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No projects added yet.</p>
              <button
                onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
                className="mt-3 text-[#00B8D4] text-sm font-medium hover:underline"
              >
                Add your first project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className={`relative pl-5 ${idx < projects.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}
                >
                  <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 ${proj.is_ongoing ? 'bg-[#00B8D4] border-[#00B8D4]' : 'bg-white border-gray-300'}`} />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-900">{proj.title}</h3>
                        {proj.is_ongoing && (
                          <span className="px-2 py-0.5 bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-semibold rounded-full">Ongoing</span>
                        )}
                      </div>
                      {(proj.start_date || proj.end_date) && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {fmtMonth(proj.start_date)}{proj.start_date ? ' – ' : ''}{proj.is_ongoing ? 'Present' : (fmtMonth(proj.end_date) || '')}
                        </p>
                      )}
                      {proj.description && (
                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{proj.description}</p>
                      )}
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {proj.tags.map((tag, ti) => (
                            <span key={ti} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              <Tag className="w-2.5 h-2.5" />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#00B8D4] hover:underline">
                          <LinkIcon className="w-3 h-3" /> View Project
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditingProject(proj); setShowProjectModal(true); }}
                        className="p-1.5 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        disabled={deletingProjectId === proj.id}
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

        {/* ── Achievements Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#00B8D4]" /> Achievements
            </h2>
            <button
              onClick={() => { setEditingAchievement(null); setShowAchievementModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A3C40] text-white text-sm font-semibold rounded-xl hover:bg-[#1A3C40]/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {loadingAchievements ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3C40]"></div>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Star className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">No achievements added yet.</p>
              <button
                onClick={() => { setEditingAchievement(null); setShowAchievementModal(true); }}
                className="mt-3 text-[#00B8D4] text-sm font-medium hover:underline"
              >
                Add your first achievement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {achievements.map((ach, idx) => (
                <div
                  key={ach.id}
                  className={`relative pl-5 ${idx < achievements.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}
                >
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-amber-400 border-amber-400" />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{ach.title}</h3>
                      {ach.issuer && (
                        <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" /> {ach.issuer}
                        </p>
                      )}
                      {ach.date && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {fmtMonth(ach.date)}
                        </p>
                      )}
                      {ach.description && (
                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{ach.description}</p>
                      )}
                      {ach.url && (
                        <a href={ach.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#00B8D4] hover:underline">
                          <LinkIcon className="w-3 h-3" /> View Certificate
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => { setEditingAchievement(ach); setShowAchievementModal(true); }}
                        className="p-1.5 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        disabled={deletingAchievementId === ach.id}
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

        {/* ── Danger Zone Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete My Account
          </button>
        </div>

      </div>

      {/* ── Modals ── */}
      {showExpModal && (
        <WorkExpModal
          exp={editingExp}
          onClose={() => { setShowExpModal(false); setEditingExp(null); }}
          onSaved={() => { setShowExpModal(false); setEditingExp(null); fetchWorkExps(); fetchProfile(); }}
        />
      )}
      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
          onSaved={() => { setShowProjectModal(false); setEditingProject(null); fetchProjects(); }}
        />
      )}
      {showAchievementModal && (
        <AchievementModal
          achievement={editingAchievement}
          onClose={() => { setShowAchievementModal(false); setEditingAchievement(null); }}
          onSaved={() => { setShowAchievementModal(false); setEditingAchievement(null); fetchAchievements(); }}
        />
      )}
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {showDeleteAccountModal && (
        <DeleteAccountModal onClose={() => setShowDeleteAccountModal(false)} />
      )}
    </div>
  );
};

export default Profile;
