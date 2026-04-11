import React, { useEffect, useState } from "react";
import NavBar from "../components/shared/NavBar";
import FilterCard from "@/components/FilterCard";
import JobsCards from "@/components/JobsCards";
import Footer from "@/components/shared/Footer";
import { SlidersHorizontal, X } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Jobs = () => {
  useGetAllJobs();

  const { allJobs = [], searchJobByText } = useSelector(
    (store) => store.jobSlice
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    if (searchJobByText) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.description
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase()) ||
          job?.location
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase()) ||
          job?.jobType
            ?.toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });

      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchJobByText]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-gray-700 font-semibold text-sm">Job Listings</h2>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 border border-[#0066FF] text-[#0066FF] text-sm px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            {filterOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <SlidersHorizontal className="h-4 w-4" />
            )}
            {filterOpen ? "Close" : "Filter"}
          </button>
        </div>

        {filterOpen && (
          <div className="lg:hidden mb-4">
            <FilterCard />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-[280px] shrink-0">
            <FilterCard />
          </div>

          {filterJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              No jobs found
            </div>
          ) : (
            <div className="flex-1 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filterJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <JobsCards job={job} />
                  </motion.div>
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