import React from "react";
import NavBar from "../components/shared/NavBar";
import JobsCards from "../components/JobsCards";
import Footer from "../components/shared/Footer";

const randomJobs = [1, 2, 3];

const Browse = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Search <span className="text-[#0066FF]">Results</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Showing {randomJobs.length} jobs found
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {randomJobs.map((item, index) => (
            <JobsCards key={index} />
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Browse;