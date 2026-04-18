import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Jobs from "./pages/Jobs";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import JobsDescription from "./pages/JobsDescription";
import AdminCompany from "./admin/pages/AdminCompany";
import AdminJobs from "./admin/pages/AdminJobs";
import RegisterCompany from "./admin/components/RegisterCompany";
import CompanySetup from "./admin/components/CompanySetup";
import CreateJob from "./admin/components/CreateJob";
import Applicants from "./admin/components/Applicants";
import ProtectedRoute from "./admin/ProtectedRoute";
import SuperAdminProtectedRoute from "./superadmin/ProtectedRoute";
import SADashboard from "./superadmin/pages/SADashboard";
import SAEmployers from "./superadmin/pages/SAEmployers";
import SAJobSeekers from "./superadmin/pages/SAJobSeekers";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, clearAuthState } from "./redux/authSlice";
import axios, { triggerSessionExpired, resetSessionExpiryHandler } from "@/utils/axiosInstance";
import { USER_API_END_POINT } from "./utils/constant";
import UpdateJob from "./admin/components/UpdateJob";
import Resume_Ranking from "./admin/pages/Resume_Ranking";
import MyResumes from "./pages/MyResumes";
import ResumeBuilder from "./pages/ResumeBuilder";
import SavedJobs from "./pages/SavedJobs";
import SessionExpiredModal from "./components/SessionExpiredModal";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionExpiresAt } = useSelector((store) => store.authSlice);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionTimerRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`);
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
  }, [dispatch]);

  useEffect(() => {
    const handleSessionExpired = () => setSessionExpired(true);
    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  useEffect(() => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (!sessionExpiresAt) return;
    const remainingTime = Number(sessionExpiresAt) - Date.now();
    if (remainingTime <= 0) { triggerSessionExpired(); return; }
    sessionTimerRef.current = setTimeout(() => triggerSessionExpired(), remainingTime);
    return () => { if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current); };
  }, [sessionExpiresAt]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleSessionExpiredClose = () => {
    setSessionExpired(false);
    resetSessionExpiryHandler();
    dispatch(clearAuthState());
    localStorage.removeItem("persist:root");
    if (location.pathname !== "/login") navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs/description/:id" element={<JobsDescription />} />

        <Route path="/admin/company" element={<ProtectedRoute><AdminCompany /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
        <Route path="/admin/company/register" element={<ProtectedRoute><RegisterCompany /></ProtectedRoute>} />
        <Route path="/admin/company/:id" element={<ProtectedRoute><CompanySetup /></ProtectedRoute>} />
        <Route path="/admin/jobs/create" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
        <Route path="/admin/jobs/:id" element={<ProtectedRoute><UpdateJob /></ProtectedRoute>} />
        <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
        <Route path="/admin/jobs/:id/resume-ranking" element={<Resume_Ranking />} />

        <Route path="/resume-builder" element={<MyResumes />} />
        <Route path="/resume-builder/:resumeId" element={<ResumeBuilder />} />

        <Route path="/superadmin/dashboard" element={<SuperAdminProtectedRoute><SADashboard /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/employers" element={<SuperAdminProtectedRoute><SAEmployers /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/jobseekers" element={<SuperAdminProtectedRoute><SAJobSeekers /></SuperAdminProtectedRoute>} />
      </Routes>

      <SessionExpiredModal open={sessionExpired} onClose={handleSessionExpiredClose} />
    </div>
  );
};

export default App;