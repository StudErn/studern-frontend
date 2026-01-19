import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CompanyProvider } from './contexts/CompanyContext'
import { HiringProvider } from './contexts/HiringContext'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
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
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import CompanyOverview from './pages/CompanyOverview'
import JobBrowse from './pages/JobBrowse'
import CreateHiring from './components/hiring/CreateHiring'
import HiringList from './components/hiring/HiringList'
import MemberManagement from './components/company/MemberManagement'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CompanyProvider>
          <HiringProvider>
            <BrowserRouter>
              <div className="app">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<RootPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-contact" element={<VerifyContact />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/internship-sprint" element={<InternshipSprintPage />} />
                  <Route path="/job-fair" element={<JobFairPage />} />
                  <Route path="/book-session" element={<BookSession />} />
                  
                  {/* Job Browsing Routes - Redirect to dashboard if logged in */}
                  <Route path="/find-jobs" element={<FindJobs />} />
                  <Route path="/jobs" element={<JobBrowse />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  
                  {/* Protected Dashboard Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<CompanyDashboardPage />} />
                    <Route path="jobs" element={<HiringList />} />
                    <Route path="jobs/create" element={<CreateHiring />} />
                    <Route path="members" element={<MemberManagement />} />
                  </Route>
                  
                  {/* Company Routes */}
                  <Route path="/create-company" element={
                    <ProtectedRoute>
                      <CreateCompany />
                    </ProtectedRoute>
                  } />
                  <Route path="/company/:companyId" element={<CompanyDashboard />}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<CompanyOverview />} />
                    <Route path="hiring" element={<HiringList />} />
                    <Route path="hiring/create" element={<CreateHiring />} />
                    <Route path="members" element={<MemberManagement />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </HiringProvider>
        </CompanyProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
