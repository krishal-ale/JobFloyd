import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Bookmark, BadgeCheck, BadgeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import defaultCompanyLogo from "@/assets/company.jpg";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.authSlice);
  const [isSaving, setIsSaving] = useState(false);

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
    e.stopPropagation();

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
    <div
      onClick={() => {
  if (!user) {
    toast.error("Please login to see job description");
    return;
  }
  navigate(`/jobs/description/${job?._id}`);
}}
      className="p-5 rounded-2xl bg-white border border-gray-300 shadow-md cursor-pointer hover:shadow-blue-100 hover:border-[#0066FF] transition-all duration-200 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
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

        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-8 w-8 shrink-0 ${
            isSaved
              ? "border-[#0066FF] text-[#0066FF] bg-blue-50 hover:bg-blue-100"
              : "border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]"
          }`}
          onClick={handleToggleSaveJob}
          disabled={isSaving}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </Button>
      </div>

      <div className="mb-4 flex-grow">
        <h1 className="font-bold text-lg text-gray-900 mb-1">{job?.title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          {job?.description?.slice(0, 100)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
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

      <Button
        onClick={handleToggleSaveJob}
        disabled={isSaving}
        className={`w-full rounded-full text-sm ${
          isSaved
            ? "bg-blue-100 text-[#0066FF] hover:bg-blue-200"
            : "bg-[#0066FF] hover:bg-blue-700 text-white"
        }`}
      >
        {isSaved ? "Saved" : "Save for Later"}
      </Button>
    </div>
  );
};

export default LatestJobCards;