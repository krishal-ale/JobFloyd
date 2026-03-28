import React, { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import NavBar from "../components/shared/NavBar";
import Footer from "../components/shared/Footer";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const JobsDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector((store) => store.jobSlice);
  const { user } = useSelector((store) => store.authSlice);

  const dispatch = useDispatch();

  const [afterApply, setAfterApply] = useState(false);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setAfterApply(true); // ✅ this updates the button

        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setAfterApply(
            res.data.job.applications.some(
              (application) =>
                application.applicant?.toString() === user?._id?.toString(),
            ),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Top Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-bold text-2xl text-gray-900 mb-3">
                {singleJob?.company?.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className="bg-blue-50 text-[#0066FF] border border-blue-100 rounded-full text-xs font-medium"
                  variant="ghost"
                >
                  {singleJob?.position}
                </Badge>
                <Badge
                  className="bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium"
                  variant="ghost"
                >
                  {singleJob?.jobType}
                </Badge>
                <Badge
                  className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium"
                  variant="ghost"
                >
                  {singleJob?.salary}
                </Badge>
              </div>
            </div>

            <Button
              onClick={afterApply ? null : applyJobHandler}
              className={`rounded-full px-6 shrink-0 ${
                afterApply
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0066FF] hover:bg-blue-700"
              }`}
            >
              {afterApply ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            Job <span className="text-[#0066FF]">Description</span>
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Role: </span>
                {singleJob?.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Location: </span>
                {singleJob?.location}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Description: </span>
                {singleJob?.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Experience: </span>
                {singleJob?.experience}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Salary: </span>
                {singleJob?.salary}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Total Positions: </span>
                {singleJob?.position}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#0066FF] shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-bold">Posted Date: </span>
                {singleJob?.createdAt?.split("T")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobsDescription;
