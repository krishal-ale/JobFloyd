import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Jobs from './pages/Jobs'
import Browse from './pages/Browse'
import Profile from './pages/Profile'
import JobsDescription from './pages/JobsDescription'
import AdminCompany from './admin/pages/AdminCompany'
import AdminJobs from './admin/pages/AdminJobs'
import RegisterCompany from './admin/components/RegisterCompany'
import CompanySetup from './admin/components/CompanySetup'
import CreateJob from './admin/components/CreateJob'
import Applicants from './admin/components/Applicants'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/jobs/description/:id" element={<JobsDescription/>} />
        <Route path="/admin/company" element={<AdminCompany/>} />
        <Route path="/admin/jobs" element={<AdminJobs/>} />
        <Route path="/admin/company/register" element={<RegisterCompany/>} />
        <Route path="/admin/company/:id" element={<CompanySetup/>} />
        <Route path="/admin/jobs/create" element={<CreateJob/>} />
        <Route path="/admin/jobs/:id/applicants" element={<Applicants/>} />
      </Routes>
    </div>
  )
}

export default App