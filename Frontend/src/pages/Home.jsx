import React, { useEffect } from 'react'
import NavBar from '@/components/shared/NavBar'
import Hero from '@/components/Hero'
import Category from '@/components/Category'
import LatestJobs from '@/components/LatestJobs'
import Footer from '@/components/shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user, loading } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role === "employer") {
      navigate("/admin/company");
    }
  }, [user, loading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Category />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
}

export default Home