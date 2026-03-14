import React from 'react'
import { PopoverContent, PopoverTrigger, Popover } from '../ui/popover'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { LogOut, User2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const NavBar = () => {

  const user = false;
  return (
    <div className='bg-white border-b border-gray-100 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>

        {/* Logo */}
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Job<span className='text-blue-800'>Floyd</span>
          </h1>
        </div>

        {/* Navbar  */}
        <div className='flex items-center gap-10'>
          <ul className='flex font-medium items-center gap-8 text-gray-600'>
            <li className='hover:text-blue-800 cursor-pointer transition-colors duration-200'>Home</li>
            <li className='hover:text-blue-800 cursor-pointer transition-colors duration-200'>Jobs</li>
            <li className='hover:text-blue-800 cursor-pointer transition-colors duration-200'>Browse</li>
          </ul>

          {
            !user? (
              <div className='flex items-center gap-3'>
               <Link to="/login"> <Button variant="outline" className="hover:bg-blue-800 hover:text-white" >Login</Button></Link>
                <Link to="/signup"> <Button className="hover:bg-blue-800">Sign Up</Button></Link>
              </div>
            ) : 
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className='cursor-pointer ring-2 ring-blue-100 hover:ring-blue-400 transition-all duration-200'>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              </Avatar>
            </PopoverTrigger>

            <PopoverContent className='w-60 p-4 shadow-lg rounded-xl border border-gray-100'>

             
              <div className='flex items-center gap-3 pb-3 border-b border-gray-100'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                </Avatar>
                <div>
                  <h3 className='font-semibold text-gray-900 text-sm'>Krishal Ale</h3>
                  <p className='text-xs text-gray-500 leading-snug line-clamp-2'>
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                </div>
              </div>

              
              <div className='flex flex-col items-center gap-2 mt-3'>
                <Button
                  variant="secondary"
                  className='w-40 justify-center gap-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200'
                >
                  <User2 className='h-4 w-4' />
                  View Profile
                </Button>

                <Button
                  variant='destructive'
                  className='w-40 justify-center gap-2 hover:opacity-90 transition-opacity duration-200'
                >
                  <LogOut className='h-4 w-4' />
                  Log Out
                </Button>
              </div>

            </PopoverContent>
          </Popover>
          }

          
        </div>

      </div>
    </div>
  )
}

export default NavBar