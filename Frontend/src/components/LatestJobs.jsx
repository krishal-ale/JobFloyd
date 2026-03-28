import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'





const LatestJobs = () => {
  const {allJobs} = useSelector(store=>store.jobSlice);

  return (
    <div className='bg-white px-4 py-10'>
      <div className='max-w-7xl mx-auto'>

        <div className='mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Latest <span className='text-[#0066FF]'>Job Openings</span>
          </h1>
          <p className='text-gray-400 text-sm mt-1'>Hand-picked jobs updated daily just for you</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {allJobs?.length === 0 ? <span className='text-gray-400 text-lg mt-1'>No Jobs Available</span> : allJobs?.slice(0,6).map((job) => (
            <LatestJobCards key={job._id} job={job}/>
          ))}
        </div>

      </div>
    </div>
  )
}

export default LatestJobs