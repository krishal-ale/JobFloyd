import React, { useState } from "react";
import NavBar from "../components/shared/NavBar";
import FilterCard from "@/components/FilterCard";
import JobsCards from "@/components/JobsCards";
import Footer from "@/components/shared/Footer";
import { SlidersHorizontal, X } from "lucide-react";

const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Mobile filter toggle button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-gray-700 font-semibold text-sm">Job Listings</h2>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 border border-[#0066FF] text-[#0066FF] text-sm px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            {filterOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            {filterOpen ? "Close" : "Filter"}
          </button>
        </div>

        {/* Mobile filter dropdown */}
        {filterOpen && (
          <div className="lg:hidden mb-4">
            <FilterCard />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left side: filter - desktop only */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <FilterCard />
          </div>

          {/* Right side: job listings */}
          {jobsArray.length <= 0 ? (
            <div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
              No jobs found
            </div>
          ) : (
            <div className="flex-1 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobsArray.map((item, index) => (
                  <JobsCards key={index} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;