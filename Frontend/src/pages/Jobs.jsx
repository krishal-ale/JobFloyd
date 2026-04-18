import React, { useEffect, useState } from "react";
import NavBar from "../components/shared/NavBar";
import FilterCard from "@/components/FilterCard";
import JobsCards from "@/components/JobsCards";
import Footer from "@/components/shared/Footer";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JOBS_PER_PAGE = 8;

const Jobs = () => {
  useGetAllJobs();

  const dispatch = useDispatch();
  const { allJobs = [], searchJobByText } = useSelector((store) => store.jobSlice);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterJobs, setFilterJobs] = useState([]);
  const [searchInput, setSearchInput] = useState(searchJobByText || "");
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);

  useEffect(() => {
    setSearchInput(searchJobByText || "");
  }, [searchJobByText]);

  // Reset visible count when filters/search changes
  useEffect(() => {
    setVisibleCount(JOBS_PER_PAGE);
  }, [searchJobByText, allJobs]);

  const isSalaryRange = (value) => /^\d+k-\d+k$/i.test(value);

  const parseSalaryRange = (range) => {
    const [min, max] = range.toLowerCase().split("-");
    return {
      minValue: Number(min.replace("k", "")) * 1000,
      maxValue: Number(max.replace("k", "")) * 1000,
    };
  };

  useEffect(() => {
    if (searchJobByText?.trim()) {
      const searchValue = searchJobByText.toLowerCase().trim();
      const filteredJobs = allJobs.filter((job) => {
        if (isSalaryRange(searchValue)) {
          const { minValue, maxValue } = parseSalaryRange(searchValue);
          return job?.salary >= minValue && job?.salary <= maxValue;
        }
        return (
          job?.title?.toLowerCase().includes(searchValue) ||
          job?.description?.toLowerCase().includes(searchValue) ||
          job?.location?.toLowerCase().includes(searchValue) ||
          job?.jobType?.toLowerCase().includes(searchValue) ||
          job?.company?.name?.toLowerCase().includes(searchValue)
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchJobByText]);

  const handleSearch = () => dispatch(setSearchJobByText(searchInput.trim()));
  const handleClearSearch = () => { setSearchInput(""); dispatch(setSearchJobByText("")); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const visibleJobs = filterJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filterJobs.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8">

        {/* Search bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-5 shadow-sm mb-4 sm:mb-6">

          {/* Mobile layout: stacked */}
          <div className="flex sm:hidden items-center bg-gray-50 rounded-full px-4 border border-gray-200 mb-3 h-11">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <Input
              type="text"
              placeholder="Search jobs, companies…"
              className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchInput && (
              <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex sm:hidden gap-2">
            <Button onClick={handleSearch} className="flex-1 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full text-sm h-10">
              Search
            </Button>
            <Button variant="outline" onClick={handleClearSearch} className="flex-1 rounded-full border-gray-300 text-sm h-10">
              Clear
            </Button>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-1.5 border border-[#0066FF] text-[#0066FF] text-sm px-4 rounded-full hover:bg-blue-50 transition-colors h-10 shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop layout: single row */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center flex-1 bg-gray-50 rounded-full px-4 border border-gray-200 h-11">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <Input
                type="text"
                placeholder="Search jobs, companies, locations, or keywords"
                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchInput && (
                <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-full px-6 h-11 text-sm shrink-0">
              Search
            </Button>
          </div>

          <div className="mt-3 text-xs sm:text-sm text-gray-500">
            {searchJobByText?.trim()
              ? `${filterJobs.length} result${filterJobs.length !== 1 ? "s" : ""} for "${searchJobByText}"`
              : `${filterJobs.length} job${filterJobs.length !== 1 ? "s" : ""} available`}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">

          {/* Sidebar filter — desktop */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <FilterCard />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-600 font-medium text-sm">No jobs found</p>
                <p className="text-gray-400 text-xs mt-1">Try different keywords or clear your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {visibleJobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.3 }}
                    >
                      <JobsCards job={job} />
                    </motion.div>
                  ))}
                </div>

                {/* See More */}
                {hasMore && (
                  <div className="flex flex-col items-center mt-8 gap-2">
                    <p className="text-xs text-gray-400">
                      Showing {visibleCount} of {filterJobs.length} jobs
                    </p>
                    <button
                      onClick={() => setVisibleCount((prev) => prev + JOBS_PER_PAGE)}
                      className="flex items-center gap-2 bg-white border border-[#0066FF] text-[#0066FF] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 shadow-sm"
                    >
                      See More Jobs
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* All loaded indicator */}
                {!hasMore && filterJobs.length > JOBS_PER_PAGE && (
                  <div className="flex items-center justify-center mt-8">
                    <p className="text-xs text-gray-400 border border-gray-200 rounded-full px-4 py-1.5 bg-white">
                      ✓ All {filterJobs.length} jobs loaded
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">Filter Jobs</span>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-4 py-4">
                <FilterCard />
              </div>
              <div className="px-4 pb-6 pt-2">
                <Button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-[#0066FF] hover:bg-blue-700 text-white rounded-full h-11 text-sm font-semibold"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Jobs;