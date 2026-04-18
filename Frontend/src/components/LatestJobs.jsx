import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.jobSlice);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.authSlice);

  return (
    <div className='bg-white px-4 py-10'>
      <div className='max-w-7xl mx-auto'>

        <div className='flex items-start justify-between mb-6 gap-2'>
          <div>
            <h1 className='text-xl sm:text-3xl font-bold text-gray-900'>
              Latest <span className='text-[#0066FF]'>Job Openings</span>
            </h1>
            <p className='text-gray-400 text-xs sm:text-sm mt-1'>Hand-picked jobs updated daily just for you</p>
          </div>
          {allJobs?.length > 0 && (
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to see all jobs.");
                  return;
                }
                navigate('/jobs');
              }}
              className='shrink-0 text-xs sm:text-sm text-[#0066FF] font-semibold border border-[#0066FF] rounded-full px-3.5 py-1.5 hover:bg-blue-50 transition-colors mt-0.5'
            >
              View All
            </button>
          )}
        </div>

        {allJobs?.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='text-4xl mb-3'>📭</div>
            <p className='text-gray-500 font-medium text-sm'>No jobs available right now</p>
            <p className='text-gray-400 text-xs mt-1'>Check back soon — new listings are added daily</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {allJobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default LatestJobs