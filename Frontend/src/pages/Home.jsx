import React, { useEffect } from 'react'
import NavBar from '@/components/shared/NavBar'
import Hero from '@/components/Hero'
import Category from '@/components/Category'
import LatestJobs from '@/components/LatestJobs'
import Footer from '@/components/shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import zeroToHero from '@/assets/zero_to_hero.png'

const Home = () => {
  useGetAllJobs();
  const { user, loading  } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role === "employer") {
      navigate("/admin/company");
    }
}, [user, loading]);

  return (
    <div>
      <NavBar />
      <Hero />
      {user ? (
        <>
          <Category />
          <LatestJobs />
        </>
      ) : (
        <div className="flex justify-center items-center">
          <img src={zeroToHero} alt="Zero to Hero" className=" w-full object-contain" />
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Home