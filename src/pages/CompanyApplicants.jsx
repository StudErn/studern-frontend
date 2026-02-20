import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import {
  ArrowLeft,
  Users,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  XCircle,
  FileText,
  User,
  Video,
  FolderKanban,
  Award,
  Link as LinkIcon,
} from 'lucide-react';

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'all',         label: 'All',         color: 'text-gray-600',   bg: 'bg-gray-100' },
  { key: 'reviewing',   label: 'Reviewing',   color: 'text-blue-700',   bg: 'bg-blue-100' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'text-purple-700', bg: 'bg-purple-100' },
  { key: 'rejected',    label: 'Rejected',    color: 'text-red-700',    bg: 'bg-red-100' },
  { key: 'accepted',    label: 'Accepted',    color: 'text-green-700',  bg: 'bg-green-100' },
];

const statusStyle = (status) => {
  switch (status) {
    case 'pending':     return 'bg-yellow-100 text-yellow-700';
    case 'reviewing':   return 'bg-blue-100 text-blue-700';
    case 'shortlisted': return 'bg-purple-100 text-purple-700';
    case 'rejected':    return 'bg-red-100 text-red-700';
    case 'accepted':    return 'bg-green-100 text-green-700';
    default:            return 'bg-gray-100 text-gray-600';
  }
};

const StatusIcon = ({ status, className = 'w-4 h-4' }) => {
  switch (status) {
    case 'pending':     return <Clock className={className} />;
    case 'reviewing':   return <AlertCircle className={className} />;
    case 'shortlisted': return <Star className={className} />;
    case 'rejected':    return <XCircle className={className} />;
    case 'accepted':    return <CheckCircle className={className} />;
    default:            return <FileText className={className} />;
  }
};

// ─── Format date helpers ─────────────────────────────────────────────────────
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtMonth = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;

// ─── Applicant Detail Slide-over ─────────────────────────────────────────────
const ApplicantProfile = ({ companyId, hiringId, applicationId, onClose, onStatusChange }) => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmAccept, setConfirmAccept] = useState(false);
  const [notes, setNotes] = useState('');
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [schedulingInterview, setSchedulingInterview] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    title: '', scheduled_at: '', interview_type: 'video',
    duration_minutes: 60, meeting_link: '', location: '', notes: '',
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/companies/${companyId}/hiring/${hiringId}/applications/${applicationId}`
        );
        // backend returns { application: { ... } } under data, normalize to legacy shape
        const payload = res.data?.data?.application || res.data?.data || null;
        if (payload) {
          const normalized = { ...payload };
          if (payload.applicant) {
            const fullName = payload.applicant.name || '';
            const parts = fullName.split(' ').filter(Boolean);
            const first = parts.shift() || '';
            const last = parts.join(' ') || '';
            normalized.user = {
              firstname: first,
              lastname: last,
              current_job_title: payload.applicant.current_job || payload.applicant.current_job_title || null,
              current_company_name: payload.applicant.current_company || payload.applicant.current_company_name || null,
              work_experiences: payload.applicant.work_experiences || [],
              projects: payload.applicant.projects || [],
              achievements: payload.applicant.achievements || [],
            };
          }
          setData(normalized);
        } else {
          setData(null);
        }
      } catch {
        showToast('Failed to load applicant profile', 'error');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicationId]);

  const handleStatus = async (newStatus) => {
    if (newStatus === 'accepted' && !confirmAccept) {
      setConfirmAccept(true);
      return;
    }
    setUpdating(true);
    try {
      await axios.patch(
        `/companies/${companyId}/hiring/${hiringId}/applications/${applicationId}/status`,
        { status: newStatus, notes }
      );
      showToast(
        newStatus === 'accepted'
          ? 'Applicant accepted — their profile has been updated!'
          : `Status updated to ${newStatus}`,
        'success'
      );
      onStatusChange(applicationId, newStatus);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
      setConfirmAccept(false);
    }
  };

  const handleCallForInterview = async () => {
    if (!interviewForm.title.trim() || !interviewForm.scheduled_at) {
      return;
    }
    setSchedulingInterview(true);
    try {
      await axios.post(
        `/companies/${companyId}/hiring/${hiringId}/applications/${applicationId}/interview`,
        interviewForm
      );
      showToast('Interview scheduled! The applicant will see it in their dashboard.', 'success');
      onStatusChange(applicationId, 'shortlisted');
      setShowInterviewForm(false);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to schedule interview', 'error');
    } finally {
      setSchedulingInterview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">Applicant Profile</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3C40]" />
          </div>
        ) : !data ? null : (
          <div className="px-6 py-5 space-y-6">
            {/* Applicant hero */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1A3C40] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {((data.user?.firstname?.[0] || '') + (data.user?.lastname?.[0] || '')).toUpperCase() || <User className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">
                  {[data.user?.firstname, data.user?.middlename, data.user?.lastname].filter(Boolean).join(' ')}
                </h3>
                {(data.user?.current_job_title || data.user?.current_company_name) && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {data.user.current_job_title}
                    {data.user.current_job_title && data.user.current_company_name ? ' · ' : ''}
                    {data.user.current_company_name}
                  </p>
                )}
                <div className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle(data.status)}`}>
                  <StatusIcon status={data.status} className="w-3 h-3" />
                  <span className="capitalize">{data.status}</span>
                </div>
              </div>
            </div>

            {/* Application meta */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Applied</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{fmtDate(data.applied_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Position</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.hiring?.job_title || '—'}</p>
              </div>
            </div>

            {/* Cover Letter */}
            {data.cover_letter && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#00B8D4]" /> Cover Letter
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4">
                  {data.cover_letter}
                </p>
              </div>
            )}

            {/* Work Experience */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#00B8D4]" /> Work Experience
              </h4>
              {(!data.user?.work_experiences || data.user.work_experiences.length === 0) ? (
                <p className="text-sm text-gray-400 italic">No work experience listed.</p>
              ) : (
                <div className="space-y-4">
                  {data.user.work_experiences.map((exp, idx) => (
                    <div key={exp.id} className={`relative pl-5 ${idx < data.user.work_experiences.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                      <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 ${exp.is_current ? 'bg-[#00B8D4] border-[#00B8D4]' : 'bg-white border-gray-300'}`} />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{exp.job_title}</span>
                        {exp.is_current && <span className="px-2 py-0.5 bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-semibold rounded-full">Current</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        {exp.company_name}
                        {exp.employment_type && <span className="text-gray-400 ml-1 capitalize">· {exp.employment_type.replace(/_/g, ' ')}</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {fmtMonth(exp.start_date)} – {exp.is_current ? 'Present' : (fmtMonth(exp.end_date) || '—')}
                        </span>
                        {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.location}</span>}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects */}
            {data.user?.projects && data.user.projects.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <FolderKanban className="w-4 h-4 text-[#00B8D4]" /> Projects
                </h4>
                <div className="space-y-3">
                  {data.user.projects.map((project) => (
                    <div key={project.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{project.title}</p>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[#00B8D4] hover:underline flex-shrink-0">
                            <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{project.description}</p>
                      )}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.split(',').map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-xs text-gray-600 rounded-full">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {data.user?.achievements && data.user.achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00B8D4]" /> Achievements
                </h4>
                <div className="space-y-2">
                  {data.user.achievements.map((ach) => (
                    <div key={ach.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{ach.title}</p>
                        {ach.issuer && <p className="text-xs text-gray-500 mt-0.5">{ach.issuer}</p>}
                        {ach.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ach.description}</p>}
                        {ach.year && <p className="text-xs text-gray-400 mt-1">{ach.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {['pending', 'reviewing', 'shortlisted'].includes(data.status) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Add a note about this applicant…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] resize-none"
                />
              </div>
            )}

            {/* Confirm Accept Banner */}
            {confirmAccept && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">⚠ Confirm Acceptance</p>
                <p>Accepting will automatically create a work experience entry on the applicant's profile. This action cannot be undone.</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setConfirmAccept(false)}
                    className="flex-1 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatus('accepted')}
                    disabled={updating}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-60"
                  >
                    {updating ? 'Accepting…' : 'Yes, Accept'}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!confirmAccept && !showInterviewForm && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {data.status === 'pending' && (
                  <button
                    onClick={() => handleStatus('reviewing')}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                  >
                    Mark Reviewing
                  </button>
                )}
                {['pending', 'reviewing'].includes(data.status) && (
                  <button
                    onClick={() => handleStatus('shortlisted')}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-60"
                  >
                    Shortlist
                  </button>
                )}
                {['reviewing', 'shortlisted'].includes(data.status) && (
                  <button
                    onClick={() => setShowInterviewForm(true)}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-[#1A3C40] text-white rounded-xl text-sm font-bold hover:bg-[#1A3C40]/90 disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-4 h-4" /> Call for Interview
                  </button>
                )}
                {['reviewing', 'shortlisted'].includes(data.status) && (
                  <button
                    onClick={() => handleStatus('accepted')}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60"
                  >
                    Accept
                  </button>
                )}
                {!['rejected', 'accepted'].includes(data.status) && (
                  <button
                    onClick={() => handleStatus('rejected')}
                    disabled={updating}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-60"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                )}
              </div>
            )}

            {/* Interview Scheduling Form */}
            {showInterviewForm && (
              <div className="mt-1 p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-600" /> Schedule Interview
                  </p>
                  <button onClick={() => setShowInterviewForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Interview Title *</label>
                  <input
                    type="text"
                    value={interviewForm.title}
                    onChange={e => setInterviewForm({ ...interviewForm, title: e.target.value })}
                    placeholder="e.g. Technical Round 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={interviewForm.scheduled_at}
                      onChange={e => setInterviewForm({ ...interviewForm, scheduled_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select
                      value={interviewForm.interview_type}
                      onChange={e => setInterviewForm({ ...interviewForm, interview_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    >
                      <option value="video">Video</option>
                      <option value="phone">Phone</option>
                      <option value="in-person">In-Person</option>
                      <option value="technical">Technical</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      value={interviewForm.duration_minutes}
                      onChange={e => setInterviewForm({ ...interviewForm, duration_minutes: parseInt(e.target.value) || 60 })}
                      min={15} max={480}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {interviewForm.interview_type === 'in-person' ? 'Location' : 'Meeting Link'}
                    </label>
                    <input
                      type="text"
                      value={interviewForm.interview_type === 'in-person' ? interviewForm.location : interviewForm.meeting_link}
                      onChange={e => interviewForm.interview_type === 'in-person'
                        ? setInterviewForm({ ...interviewForm, location: e.target.value })
                        : setInterviewForm({ ...interviewForm, meeting_link: e.target.value })
                      }
                      placeholder={interviewForm.interview_type === 'in-person' ? 'Office address' : 'https://meet.google.com/...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D4] bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowInterviewForm(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCallForInterview}
                    disabled={schedulingInterview || !interviewForm.title.trim() || !interviewForm.scheduled_at}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-60"
                  >
                    {schedulingInterview ? 'Scheduling…' : 'Confirm & Schedule'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CompanyApplicants = () => {
  const { hiringId } = useParams();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { showToast } = useToast();

  const companyId = selectedCompany?.id;

  const [applications, setApplications] = useState([]);
  const [hiringTitle, setHiringTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const fetchApplications = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const params = { page, per_page: 15 };
      if (activeTab !== 'all') params.status = activeTab;
      const res = await axios.get(
        `/companies/${companyId}/hiring/${hiringId}/applications`,
        { params }
      );
      const d = res.data.data;
      // backend returns `applicants` and `hiring_title` on company list
      setApplications(d.applicants || []);
      setPagination(d.pagination || null);
      if (d.hiring_title) setHiringTitle(d.hiring_title || '');
    } catch {
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [companyId, hiringId, activeTab, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = (appId, newStatus) => {
    // Optimistic update in list
    setApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
    );
  };

  if (!companyId) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        No company selected.
      </div>
    );
  }

  // Count per status for tab badges
  const countForTab = (tabKey) => {
    if (tabKey === 'all') return applications.length;
    return applications.filter(a => a.status === tabKey).length;
  };

  const filtered = activeTab === 'all'
    ? applications
    : applications.filter(a => a.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/jobs')}
            className="p-2 text-gray-400 hover:text-[#1A3C40] hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            {hiringTitle && (
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> {hiringTitle}
              </p>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex flex-wrap gap-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? `${tab.bg} ${tab.color}`
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {pagination === null && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-white/60' : 'bg-gray-100'}`}>
                  {countForTab(tab.key)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Application List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3C40]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="text-base font-medium">No applications {activeTab !== 'all' ? `with status "${activeTab}"` : 'yet'}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              // Support both old and new API shapes
              const id = app.id || app.application_id;
              const applicant = app.user || app.applicant || {};
              const name = applicant.firstname || applicant.lastname
                ? [applicant.firstname, applicant.lastname].filter(Boolean).join(' ')
                : (applicant.name || 'Unknown');
              const initials = (name.split(' ').map(s => s[0] || '').join('').slice(0,2) || '').toUpperCase();
              const headline = applicant.current_job || applicant.current_job_title
                ? `${applicant.current_job || applicant.current_job_title}${(applicant.current_company || applicant.current_company_name) ? ' · ' + (applicant.current_company || applicant.current_company_name) : ''}`
                : null;

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4 hover:border-[#00B8D4]/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedAppId(id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#1A3C40] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {initials || <User className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">{name}</p>
                      {headline && <p className="text-xs text-gray-500 mt-0.5 truncate">{headline}</p>}
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied {fmtDate(app.applied_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(app.status)}`}>
                      <StatusIcon status={app.status} className="w-3 h-3" />
                      <span className="capitalize">{app.status}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                  p === page ? 'bg-[#1A3C40] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Applicant Profile Slide-over */}
      {selectedAppId && (
        <ApplicantProfile
          companyId={companyId}
          hiringId={hiringId}
          applicationId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default CompanyApplicants;
