import React from 'react'
import LatestJobCards from './LatestJobCards'

const sampleJobs = [1,2,3,4,5,6,7,8,9,10]

const LatestJobs = () => {
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
          {sampleJobs.slice(0,6).map((item, index) => (
            <LatestJobCards key={index}/>
          ))}
        </div>

      </div>
    </div>
  )
}

export default LatestJobs