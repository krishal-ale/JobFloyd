import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400 px-5 py-10 mt-2'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8'>

        {/* Left */}
        <div>
          <h1 className='text-white text-xl font-extrabold mb-2'>
            Job<span className='text-[#0066FF]'>Floyd</span>
          </h1>
          <p className='text-sm max-w-xs leading-relaxed'>
            Your trusted platform to find the best jobs and connect with top companies.
          </p>
        </div>

        {/* Middle */}
        <div>
          <h2 className='text-white font-semibold mb-3'>Contact Us</h2>
          <ul className='flex flex-col gap-3 text-sm'>
            <li>
              <a href='mailto:alekrishal@gmail.com' className='flex items-center gap-2.5 hover:text-white transition-colors'>
                <Mail className='h-4 w-4 text-[#0066FF] shrink-0' />
                alekrishal@gmail.com
              </a>
            </li>
            <li>
              <a href='tel:9816375736' className='flex items-center gap-2.5 hover:text-white transition-colors'>
                <Phone className='h-4 w-4 text-[#0066FF] shrink-0' />
                9816375736
              </a>
            </li>
            <li>
              <a href='tel:9844423048' className='flex items-center gap-2.5 hover:text-white transition-colors'>
                <Phone className='h-4 w-4 text-[#0066FF] shrink-0' />
                9844423048
              </a>
            </li>
            <li className='flex items-center gap-2.5'>
              <MapPin className='h-4 w-4 text-[#0066FF] shrink-0' />
              Biratnagar-11, Morang
            </li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h2 className='text-white font-semibold mb-3'>Follow Us</h2>
          <div className='flex items-center gap-4'>
            <a href='#' aria-label='Facebook' className='p-2 rounded-full bg-gray-800 hover:bg-[#0066FF] hover:text-white transition-all duration-200'>
              <Facebook className='h-4 w-4' />
            </a>
            <a href='#' aria-label='Twitter' className='p-2 rounded-full bg-gray-800 hover:bg-[#0066FF] hover:text-white transition-all duration-200'>
              <Twitter className='h-4 w-4' />
            </a>
            <a href='#' aria-label='Instagram' className='p-2 rounded-full bg-gray-800 hover:bg-[#0066FF] hover:text-white transition-all duration-200'>
              <Instagram className='h-4 w-4' />
            </a>
            <a href='#' aria-label='Linkedin' className='p-2 rounded-full bg-gray-800 hover:bg-[#0066FF] hover:text-white transition-all duration-200'>
              <Linkedin className='h-4 w-4' />
            </a>
          </div>
          <p className='text-xs text-gray-500 mt-4'>
            Made by JobFloyd Team
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className='max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-5 text-center text-xs text-gray-500'>
        © {new Date().getFullYear()} JobFloyd. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer