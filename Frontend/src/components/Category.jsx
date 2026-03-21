import React from 'react'
import { CarouselContent, Carousel, CarouselItem, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { CarouselNext } from "@/components/ui/carousel"

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile App Developer",
    "UI/UX Designer",
    "Product Manager",
    "Project Manager",
]

const Category = () => {
  return (
    <div className='bg-gray-50 px-4 py-10'>

      <div className='text-center mb-6'>
        <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>
          What are you <span className='text-[#0066FF]'>looking for?</span>
        </h2>
        <p className='text-gray-400 text-sm mt-1'>Pick a category and explore matching jobs</p>
      </div>

      <Carousel className='w-full max-w-xl mx-auto'>
        <CarouselContent>
          {category.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Button
                variant='outline'
                className='rounded-full border-2 border-gray-200 text-gray-700 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-blue-50 transition-all duration-200 text-sm font-medium px-4 py-2 w-full'
              >
                {item}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    </div>
  )
}

export default Category