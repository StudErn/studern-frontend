import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FindJobs from './pages/FindJobs'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CoursesPage from './pages/CoursesPage'
import InternshipSprintPage from './pages/InternshipSprintPage'
import JobFairPage from './pages/JobFairPage'
import BookSession from './pages/BookSession'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/internship-sprint" element={<InternshipSprintPage />} />
          <Route path="/job-fair" element={<JobFairPage />} />
          <Route path="/book-session" element={<BookSession />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
