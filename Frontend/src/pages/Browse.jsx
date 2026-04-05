import React, { useEffect } from "react";
import NavBar from "../components/shared/NavBar";
import JobsCards from "../components/JobsCards";
import Footer from "../components/shared/Footer";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/jobSlice";

const Browse = () => {
  useGetAllJobs();

  const { allJobs } = useSelector((store) => store.jobSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
    };
  }, []);
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
            Showing {allJobs.length} jobs found
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allJobs.map((job) => (
            <JobsCards key={job._id} job={job} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
