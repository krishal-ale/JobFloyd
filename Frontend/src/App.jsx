import React, { useEffect } from 'react'
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
import ProtectedRoute from './admin/ProtectedRoute'
import { useDispatch } from 'react-redux'
import { setUser, setLoading } from './redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from './utils/constant'
import UpdateJob from './admin/components/UpdateJob'
import Resume_Ranking from './admin/pages/Resume_Ranking'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    checkAuth();
  }, []);

  return (
    <div>
      <Routes>

        {/* Job Seekers Route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/jobs/description/:id" element={<JobsDescription/>} />

        {/* Admin Route */}
        <Route path="/admin/company" element={<ProtectedRoute><AdminCompany/></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs/></ProtectedRoute>} />
        <Route path="/admin/company/register" element={<ProtectedRoute><RegisterCompany/></ProtectedRoute>} />
        <Route path="/admin/company/:id" element={<ProtectedRoute><CompanySetup/></ProtectedRoute>} />
        <Route path="/admin/jobs/create" element={<ProtectedRoute><CreateJob/></ProtectedRoute>} />
        <Route path="/admin/jobs/:id" element={<ProtectedRoute><UpdateJob/></ProtectedRoute>} />
        <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute><Applicants/></ProtectedRoute>} />
        <Route path="/admin/jobs/:id/resume-ranking" element={<Resume_Ranking />} />
      </Routes>
    </div>
  )
}

export default App