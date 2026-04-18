import React, { useEffect } from "react";
import NavBar from "../components/shared/NavBar";
import JobsCards from "../components/JobsCards";
import Footer from "../components/shared/Footer";
import { Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.authSlice);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (user?.role !== "jobseeker") {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(
            setUser({
              ...user,
              savedJobs: res.data.savedJobs,
            })
          );
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to load saved jobs");
      }
    };

    fetchSavedJobs();
  }, [dispatch, navigate]);

  const savedJobs = user?.savedJobs || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-[#0066FF] fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Saved <span className="text-[#0066FF]">Jobs</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              You have {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No saved jobs yet
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              Save jobs from the jobs page and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((job) => (
              <JobsCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedJobs;