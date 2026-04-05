import React from 'react'
import { TableBody, TableCaption, Table, TableHeader, TableRow, TableCell, TableHead } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'


const AppliedJobs = () => {
  const {allAppliedJobs} = useSelector(store=>store.jobSlice);
  return (
    <div className='rounded-xl border border-gray-100 overflow-hidden'>
      <Table>
        <TableCaption className='text-xs text-gray-400 mb-3'>
          List of all jobs you have applied to
        </TableCaption>
        <TableHeader className='bg-gray-50'>
          <TableRow>
            <TableHead className='text-xs font-semibold text-[#0066FF] uppercase tracking-wide'>Company</TableHead>
            <TableHead className='text-xs font-semibold text-[#0066FF] uppercase tracking-wide'>Job Role</TableHead>
            <TableHead className='text-xs font-semibold text-[#0066FF] uppercase tracking-wide'>Date Applied</TableHead>
            <TableHead className='text-xs font-semibold text-[#0066FF] uppercase tracking-wide text-right'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? <span>No Applied Jobs</span> : allAppliedJobs.map((appliedJob, index) => (
            <TableRow key={appliedJob._id} className='hover:bg-blue-50 transition-colors duration-150'>
              <TableCell className='text-sm text-gray-700 font-medium'>Company {appliedJob?.job?.company?.name}</TableCell>
              <TableCell className='text-sm text-gray-600'>Job Role {appliedJob?.job?.title}</TableCell>
              <TableCell className='text-sm text-gray-400'>2024-06-0{appliedJob.createdAt.split("T")[0]}</TableCell>
              <TableCell className='text-right'>
                <Badge className={appliedJob.status === "pending" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" : appliedJob.status === "accepted" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}>
                  {appliedJob.status === "pending" ? "Pending" : appliedJob.status === "accepted" ? "Accepted" : "Rejected"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobs