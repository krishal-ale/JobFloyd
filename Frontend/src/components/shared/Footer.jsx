import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400 px-6 py-10 mt-10'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-start justify-between gap-8'>

        {/* Left */}
        <div>
          <h1 className='text-white text-xl font-extrabold mb-2'>
            Job<span className='text-[#0066FF]'>Floyd</span>
          </h1>
          <p className='text-sm max-w-xs'>
            Your trusted platform to find the best jobs and connect with top companies.
          </p>
        </div>

        {/* Middle */}
        <div>
          <h2 className='text-white font-semibold mb-3'>Contact Us</h2>
          <ul className='flex flex-col gap-2 text-sm'>
            <li className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-[#0066FF] shrink-0' />
              alekrishal@gmail.com
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-[#0066FF] shrink-0' />
              9816375736
            </li>
            <li className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-[#0066FF] shrink-0' />
              9844423048
            </li>
            <li className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-[#0066FF] shrink-0' />
              Biratnagar-11, Morang
            </li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h2 className='text-white font-semibold mb-3'>Follow Us</h2>
          <div className='flex items-center gap-4'>
            <Facebook className='h-5 w-5 hover:text-[#0066FF] cursor-pointer transition-colors' />
            <Twitter className='h-5 w-5 hover:text-[#0066FF] cursor-pointer transition-colors' />
            <Instagram className='h-5 w-5 hover:text-[#0066FF] cursor-pointer transition-colors' />
            <Linkedin className='h-5 w-5 hover:text-[#0066FF] cursor-pointer transition-colors' />
          </div>
          <p className='text-xs text-gray-500 mt-4'>
            Made with love by JobFloyd Team
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className='max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-5 text-center text-xs text-gray-500'>
        {new Date().getFullYear()} JobFloyd. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer