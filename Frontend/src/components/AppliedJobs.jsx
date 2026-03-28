import React from 'react'
import { TableBody, TableCaption, Table, TableHeader, TableRow, TableCell, TableHead } from './ui/table'
import { Badge } from './ui/badge'

const AppliedJobs = () => {
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
          {[1, 2, 3, 4].map((item, index) => (
            <TableRow key={index} className='hover:bg-blue-50 transition-colors duration-150'>
              <TableCell className='text-sm text-gray-700 font-medium'>Company {item}</TableCell>
              <TableCell className='text-sm text-gray-600'>Job Role {item}</TableCell>
              <TableCell className='text-sm text-gray-400'>2024-06-0{item}</TableCell>
              <TableCell className='text-right'>
                <Badge className='bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium' variant='ghost'>
                  Selected
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