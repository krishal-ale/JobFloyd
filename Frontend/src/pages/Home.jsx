import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
  const {user} = useSelector((state) => state.authSlice);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user?.role === "employer"){
      navigate("/admin/company");
    }
  },[])

  return (
    <div>
      <NavBar />
      <Hero/>
      <Category/>
      <LatestJobs/>
      <Footer/>
    </div>
  )
}

export default Home