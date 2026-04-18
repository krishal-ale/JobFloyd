import React, { useEffect, useMemo } from "react";
import NavBar from "../components/shared/NavBar";
import JobsCards from "../components/JobsCards";
import Footer from "../components/shared/Footer";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/jobSlice";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Browse = () => {
  useGetAllJobs();

  const { allJobs, searchQuery } = useSelector((store) => store.jobSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter jobs based on search
  const filteredJobs = useMemo(() => {
    if (!searchQuery?.trim()) return allJobs;

    const lowerQuery = searchQuery.toLowerCase();

    return allJobs.filter((job) => {
      return (
        job?.title?.toLowerCase().includes(lowerQuery) ||
        job?.description?.toLowerCase().includes(lowerQuery) ||
        job?.location?.toLowerCase().includes(lowerQuery) ||
        job?.jobType?.toLowerCase().includes(lowerQuery) ||
        job?.company?.name?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [allJobs, searchQuery]);

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>


        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Search <span className="text-[#0066FF]">Results</span>
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            {searchQuery?.trim()
              ? `Showing ${filteredJobs.length} jobs for "${searchQuery}"`
              : `Showing ${allJobs.length} jobs found`}
          </p>
        </div>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
            No jobs found for{" "}
            <span className="font-semibold text-gray-700">
              "{searchQuery}"
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobsCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Browse;