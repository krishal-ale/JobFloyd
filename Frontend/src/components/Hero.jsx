import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Search, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-[#0066FF] text-white px-4 py-14 sm:py-20">

      {/* top badge */}
      <div className="flex justify-center mb-6">
        <span className="flex items-center gap-2 bg-white text-[#0066FF] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full">
          <TrendingUp className="h-4 w-4" />
          10,000+ Jobs Available Right Now
        </span>
      </div>

      {/* heading - left aligned on desktop, centered on mobile */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Your Career Journey <br />
          <span className="text-yellow-300">Starts Here.</span>
        </h1>

        <p className="text-blue-100 text-sm sm:text-lg max-w-xl mx-auto mb-10">
          Welcome to JobFloyd: Thousands of jobs. Top companies. 
          One platform — built to get you hired faster.
        </p>

        {/* search bar - white on blue bg */}
        <div className="flex w-[95%] sm:w-[70%] lg:w-[55%] mx-auto bg-white rounded-full items-center gap-2 px-3 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <Input
            type="text"
            placeholder="Search for jobs..."
            className="w-full border-none shadow-none focus-visible:ring-0 text-gray-700 text-sm sm:text-base"
          />
          <Button className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-full px-5 sm:px-7 py-5 text-xs sm:text-sm shrink-0">
            Search
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Hero;