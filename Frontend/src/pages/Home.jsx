import React from 'react'
import { Button } from "@/components/ui/button"
import NavBar from '@/components/shared/NavBar'
import Hero from '@/components/Hero'
import Category from '@/components/Category'
import LatestJobs from '@/components/LatestJobs'
import Footer from '@/components/shared/Footer'

const Home = () => {
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