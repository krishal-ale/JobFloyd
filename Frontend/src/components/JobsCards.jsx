import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, MapPin, BadgeCheck, BadgeX } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import defaultCompanyLogo from "@/assets/company.jpg";

const JobsCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.authSlice);
  const [isSaving, setIsSaving] = useState(false);

  const daysAgo = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const now = new Date();
    const timeDifference = now - createdAt;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return days;
  };

  const isAlreadyApplied = job?.applications?.some(
    (application) =>
      application?.applicant?.toString() === user?._id?.toString()
  );

  const isSaved = useMemo(() => {
    if (!user?.savedJobs?.length || !job?._id) return false;

    return user.savedJobs.some((savedJob) => {
      if (typeof savedJob === "string") {
        return savedJob === job._id;
      }
      return savedJob?._id?.toString() === job?._id?.toString();
    });
  }, [user?.savedJobs, job?._id]);

  const handleToggleSaveJob = async (e) => {
    e?.stopPropagation?.();

    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      toast.error("Only job seekers can save jobs");
      return;
    }

    try {
      setIsSaving(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${job?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-gray-300 bg-white cursor-pointer hover:border-[#0066FF] hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {daysAgo(job?.createdAt) === 0
            ? "Today"
            : `${daysAgo(job?.createdAt)} days ago`}
        </p>

        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-8 w-8 ${
            isSaved
              ? "border-[#0066FF] text-[#0066FF] bg-blue-50 hover:bg-blue-100"
              : "border-gray-400 hover:border-[#0066FF] hover:text-[#0066FF]"
          }`}
          onClick={handleToggleSaveJob}
          disabled={isSaving}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={job?.company?.logo || defaultCompanyLogo}
            alt={job?.company?.name}
          />
        </Avatar>

        <div>
          <h1 className="font-semibold text-gray-900 text-sm">
            {job?.company?.name}
          </h1>

          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job?.location}
            </p>

            {job?.company?.isVerified ? (
              <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                <BadgeX className="h-3 w-3" />
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex-grow">
        <h1 className="font-bold text-lg text-gray-900 mb-1">{job?.title}</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          {job?.description?.slice(0, 100)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <Badge
          className="bg-blue-50 text-[#0066FF] border border-blue-100 rounded-full text-xs font-medium"
          variant="ghost"
        >
          {job?.position} Positions
        </Badge>

        <Badge
          className="bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium"
          variant="ghost"
        >
          {job?.jobType}
        </Badge>

        <Badge
          className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium"
          variant="ghost"
        >
          NPR {job?.salary}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 mt-auto">
        <Button
          variant="outline"
          className={`flex-1 min-w-[140px] text-sm rounded-full px-4 transition-all ${
            isAlreadyApplied
              ? "border-green-200 text-green-700 hover:border-green-200 hover:text-green-700"
              : "border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF]"
          }`}
          onClick={() => navigate(`/jobs/description/${job?._id}`)}
        >
          {isAlreadyApplied ? "Already Applied" : "Apply Now"}
        </Button>

        <Button
          className={`flex-1 min-w-[140px] text-sm rounded-full px-4 transition-all ${
            isSaved
              ? "bg-blue-100 text-[#0066FF] hover:bg-blue-200"
              : "bg-[#0066FF] hover:bg-blue-700 text-white"
          }`}
          onClick={handleToggleSaveJob}
          disabled={isSaving}
        >
          {isSaved ? "Saved" : "Save for Later"}
        </Button>
      </div>
    </div>
  );
};

export default JobsCards;