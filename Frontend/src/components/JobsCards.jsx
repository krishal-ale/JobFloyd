import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const JobsCards = ({job}) => {
  const navigate = useNavigate();
  
  const daysAgo = (mongodbTime) =>{
     const createdAt = new Date(mongodbTime);
     const now = new Date();
     const timeDifference = now - createdAt;
     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
     return days;
  }
  return (
    <div className='p-5 rounded-2xl border border-gray-400 bg-white cursor-pointer hover:border-[#0066FF] hover:shadow-md transition-all duration-200'>

      {/* Top row */}
      <div className='flex items-center justify-between mb-3'>
        <p className='text-xs text-gray-400'>{daysAgo(job?.createdAt) === 0 ? "Today" : daysAgo(job?.createdAt) + " days ago"}</p>
        <Button variant='outline' size='icon' className='rounded-full border-gray-400 hover:border-[#0066FF] hover:text-[#0066FF] h-8 w-8'>
          <Bookmark className='h-4 w-4' />
        </Button>
      </div>

      {/* Company info */}
      <div className='flex items-center gap-3 mb-4'>
        <Avatar className='h-10 w-10'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
        <div>
          <h1 className='font-semibold text-gray-900 text-sm'>{job?.company?.name}</h1>
          <p className='text-xs text-gray-400 flex items-center gap-1'>
            <MapPin className='h-3 w-3' /> {job?.location}
          </p>
        </div>
      </div>

      {/* Job info */}
      <div className='mb-4'>
        <h1 className='font-bold text-lg text-gray-900 mb-1'>{job?.title}</h1>
        <p className='text-sm text-gray-500 leading-relaxed'>
          {job?.description?.slice(0, 100)}
        </p>
      </div>

      {/* Badges */}
      <div className='flex items-center gap-2 flex-wrap mb-5'>
        <Badge className='bg-blue-50 text-[#0066FF] border border-blue-100 rounded-full text-xs font-medium' variant='ghost'>
         {job?.position}
        </Badge>
        <Badge className='bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium' variant='ghost'>
          {job?.jobType}
        </Badge>
        <Badge className='bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium' variant='ghost'>
          {job?.salary}
        </Badge>
      </div>

      {/* Buttons */}
      <div className='flex items-center gap-3'>
        <Button variant='outline' className='border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] text-sm rounded-full px-5 transition-all' onClick={()=>navigate(`/jobs/description/${job?._id}`)}>
          Apply Now
        </Button>
        <Button className='bg-[#0066FF] hover:bg-blue-700 text-white text-sm rounded-full px-5 transition-all'>
          Save for Later
        </Button>
      </div>

    </div>
  )
}

export default JobsCards