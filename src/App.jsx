import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ViewProvider } from './contexts/ViewContext'
import { CompanyProvider } from './contexts/CompanyContext'
import { HiringProvider } from './contexts/HiringContext'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import PostJobRedirect from './components/PostJobRedirect'
import AppLayout from './components/AppLayout'
import RootPage from './pages/RootPage'
import FindJobs from './pages/FindJobs'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyContact from './pages/VerifyContact'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CoursesPage from './pages/CoursesPage'
import InternshipSprintPage from './pages/InternshipSprintPage'
import JobFairPage from './pages/JobFairPage'
import BookSession from './pages/BookSession'
import CreateCompany from './pages/CreateCompany'
import Dashboard from './pages/Dashboard'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import CompanyOverview from './pages/CompanyOverview'
import DashboardJobs from './pages/DashboardJobs'
import JobBrowse from './pages/JobBrowse'
import CreateHiring from './components/hiring/CreateHiring'
import HiringList from './components/hiring/HiringList'
import EditHiring from './components/hiring/EditHiring'
import MemberManagement from './components/company/MemberManagement'
import EditCompany from './components/company/EditCompany'
import SystemSettings from './pages/SystemSettings'
import AdminUsers from './pages/AdminUsers'
import AdminCompanies from './pages/AdminCompanies'
import AdminHiring from './pages/AdminHiring'
import Applications from './pages/Applications'
import Interviews from './pages/Interviews'
import SavedJobs from './pages/SavedJobs'
import ApplicationDetail from './pages/ApplicationDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ApplicantFindJobs from './pages/ApplicantFindJobs'
import ApplicantJobDetails from './pages/ApplicantJobDetails'
import ApplicantJobs from './pages/ApplicantJobs'
import ApplicantInternships from './pages/ApplicantInternships'
import CompanyApplicants from './pages/CompanyApplicants'
import PaymentReturn from './pages/PaymentReturn'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import LinkedInAuthCallback from './pages/LinkedInAuthCallback'
import GitHubAuthCallback from './pages/GitHubAuthCallback'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ViewProvider>
          <CompanyProvider>
            <HiringProvider>
              <BrowserRouter>
              <div className="app">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<RootPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/find-jobs" element={<FindJobs />} />
                  <Route path="/find-internships" element={<FindJobs />} />
                  <Route path="/internships" element={<Navigate to="/find-internships" replace />} />
                  <Route path="/jobs" element={<JobBrowse />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/verify-contact" element={<VerifyContact />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/internship-sprint" element={<InternshipSprintPage />} />
                  <Route path="/job-fair" element={<JobFairPage />} />
                  <Route path="/book-session" element={<BookSession />} />
                  
                  {/* Payment return page — bKash redirects here after payment */}
                  <Route path="/payment/return" element={<PaymentReturn />} />

                  {/* Google OAuth callback — backend redirects here after OAuth */}
                  <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

                  {/* LinkedIn OAuth callback — backend redirects here after OAuth */}
                  <Route path="/auth/linkedin/callback" element={<LinkedInAuthCallback />} />

                  {/* GitHub OAuth callback — backend redirects here after OAuth */}
                  <Route path="/auth/github/callback" element={<GitHubAuthCallback />} />
                  
                  {/* Post Job Route - redirects based on auth status */}
                  <Route path="/post-job" element={<PostJobRedirect />} />
                  
                  {/* Protected User Routes - Wrapped in AppLayout */}
                  <Route element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/find-jobs" element={<ApplicantFindJobs />} />
                    <Route path="/dashboard/find-jobs/jobs" element={<ApplicantJobs />} />
                    <Route path="/dashboard/find-jobs/internships" element={<ApplicantInternships />} />
                    <Route path="/dashboard/find-jobs/:id" element={<ApplicantJobDetails />} />
                    <Route path="/dashboard/applications" element={<Applications />} />
                    <Route path="/dashboard/applications/:id" element={<ApplicationDetail />} />
                    <Route path="/dashboard/interviews" element={<Interviews />} />
                    <Route path="/dashboard/saved-jobs" element={<SavedJobs />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                    <Route path="/dashboard/settings" element={<Settings />} />

                    {/* Backwards-compatible redirects for legacy routes */}
                    <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
                    <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
                    
                    {/* Recruiter Routes */}
                    <Route path="/dashboard/jobs" element={<DashboardJobs />} />
                    <Route path="/dashboard/jobs/create" element={<CreateHiring />} />
                    <Route path="/dashboard/jobs/:id/edit" element={<EditHiring />} />
                    <Route path="/dashboard/jobs/:hiringId/applicants" element={<CompanyApplicants />} />
                    <Route path="/dashboard/company/:companyId/edit" element={<EditCompany />} />
                    <Route path="/dashboard/members" element={<MemberManagement />} />
                  </Route>

                  {/* Admin Routes - Control Panel */}
                  <Route path="/control-panel" element={
                    <ProtectedRoute checkRole="admin">
                      <AppLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="companies" element={<AdminCompanies />} />
                    <Route path="hiring" element={<AdminHiring />} />
                    <Route path="settings" element={<SystemSettings />} />
                  </Route>
                  
                  {/* Company Creation */}
                  <Route path="/create-company" element={
                    <ProtectedRoute>
                      <CreateCompany />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </BrowserRouter>
          </HiringProvider>
        </CompanyProvider>
        </ViewProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
