import React from 'react'
import { Badge } from "@/components/ui/badge"
import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
  const Navigate = useNavigate();
  return (
    <div onClick={()=>Navigate(`/jobs/description/${job._id}`)} className='p-5 rounded-2xl bg-white border border-gray-400 shadow-md cursor-pointer hover:shadow-blue-100 hover:border-[#0066FF] transition-all duration-200'>

      {/* Company info */}
      <div className='mb-4'>
        <h1 className='font-semibold text-gray-900 text-sm'>{job?.company?.name}</h1>
        <p className='text-xs text-gray-400 flex items-center gap-1 mt-1'>
          <MapPin className='h-3 w-3' /> {job?.location}
        </p>
      </div>

      {/* Job info */}
      <div className='mb-4'>
        <h1 className='font-bold text-lg text-gray-900 mb-1'>{job?.title}</h1>
        <p className='text-gray-500 text-sm leading-relaxed'>
          {job?.description?.slice(0, 100)}
        </p>
      </div>

      {/* Badges */}
      <div className='flex items-center gap-2 flex-wrap'>
        <Badge className='bg-blue-50 text-[#0066FF] border border-blue-100 rounded-full text-xs font-medium' variant='ghost'>
        {job?.position}
        </Badge>
        <Badge className='bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium' variant='ghost'>
          {job?.jobType}
        </Badge>
        <Badge className='bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium' variant='ghost'>
          NPR. {job?.salary}
        </Badge>
      </div>

    </div>
  )
}

export default LatestJobCards