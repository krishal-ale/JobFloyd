import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import NavBar from "../components/shared/NavBar";
import Footer from "../components/shared/Footer";
import {
  MapPin, Briefcase, Clock, DollarSign,
  Users, Calendar, FileText, Upload, ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@/utils/axiosInstance";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const JobsDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleJob } = useSelector((store) => store.jobSlice);
  const { user } = useSelector((store) => store.authSlice);

  const [afterApply, setAfterApply] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [useExistingResume, setUseExistingResume] = useState(false);
  const [applying, setApplying] = useState(false);

  const existingResumeAvailable = !!user?.profile?.resume;

  const selectedResumeName = useMemo(() => {
    if (selectedFile) return selectedFile.name;
    if (useExistingResume && existingResumeAvailable) {
      return user?.profile?.resumeName || "Resume.pdf";
    }
    return "";
  }, [selectedFile, useExistingResume, existingResumeAvailable, user?.profile?.resumeName]);

  const openApplyModal = () => {
    setSelectedFile(null);
    setUseExistingResume(existingResumeAvailable);
    setApplyModalOpen(true);
  };

  const applyJobHandler = async () => {
    if (!selectedFile && !useExistingResume) return;
    try {
      setApplying(true);
      const formData = new FormData();
      if (selectedFile) formData.append("resume", selectedFile);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        setAfterApply(true);
        dispatch(setSingleJob({
          ...singleJob,
          applications: [...(singleJob?.applications || []), { applicant: user?._id }],
        }));
        toast.success(res.data.message);
        setApplyModalOpen(false);
        setSelectedFile(null);
        setUseExistingResume(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/job/${jobId}`);
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setAfterApply(
            res.data.job.applications.some(
              (application) => application.applicant?.toString() === user?._id?.toString()
            )
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

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Back button */}
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-bold text-xl sm:text-2xl text-gray-900 mb-3">
                {singleJob?.company?.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-blue-50 text-[#0066FF] border border-blue-100 rounded-full text-xs font-medium" variant="ghost">
                  {singleJob?.position}
                </Badge>
                <Badge className="bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium" variant="ghost">
                  {singleJob?.jobType}
                </Badge>
                <Badge className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium" variant="ghost">
                  {singleJob?.salary}
                </Badge>
              </div>
            </div>

            <Button
              onClick={afterApply ? undefined : openApplyModal}
              disabled={afterApply}
              className={`rounded-full px-6 w-full sm:w-auto shrink-0 ${
                afterApply ? "bg-gray-400 cursor-not-allowed" : "bg-[#0066FF] hover:bg-blue-700"
              }`}
            >
              {afterApply ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Description card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
            Job <span className="text-[#0066FF]">Description</span>
          </h2>

          <div className="flex flex-col gap-4">
            {[
              { icon: Briefcase, label: "Role", value: singleJob?.title },
              { icon: MapPin,    label: "Location", value: singleJob?.location },
              { icon: Clock,     label: "Description", value: singleJob?.description },
              { icon: Clock,     label: "Experience", value: singleJob?.experience },
              { icon: DollarSign,label: "Salary", value: singleJob?.salary },
              { icon: Users,     label: "Total Positions", value: singleJob?.position },
              { icon: Calendar,  label: "Posted Date", value: singleJob?.createdAt?.split("T")[0] },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-[#0066FF] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold">{label}: </span>{value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply dialog */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-lg rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Choose Resume to Apply</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Select your existing resume or upload a new one before applying.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {existingResumeAvailable && (
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">Existing Resume</p>
                    <p className="text-xs text-gray-500 truncate">{user?.profile?.resumeName || "Resume.pdf"}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => window.open(user?.profile?.resume, "_blank")}>
                    <FileText className="h-4 w-4 mr-1.5" /> View
                  </Button>
                </div>
                <Button
                  type="button"
                  variant={useExistingResume ? "default" : "outline"}
                  className={`w-full ${useExistingResume ? "bg-[#0066FF] hover:bg-blue-700 text-white" : ""}`}
                  onClick={() => { setUseExistingResume(true); setSelectedFile(null); }}
                >
                  {useExistingResume ? "✓ Selected" : "Use This Resume"}
                </Button>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Upload New Resume</p>
              <label className="flex items-center justify-center gap-2 text-sm text-[#0066FF] cursor-pointer border-2 border-dashed border-blue-200 rounded-xl py-3 hover:bg-blue-50 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Choose PDF Resume</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedFile(file);
                    setUseExistingResume(false);
                  }}
                />
              </label>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-2 truncate">{selectedFile.name}</p>
              )}
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-xs sm:text-sm text-gray-700">
                Selected: <span className="font-medium text-gray-900">{selectedResumeName || "None"}</span>
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => { setApplyModalOpen(false); setSelectedFile(null); setUseExistingResume(false); }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={(!selectedFile && !useExistingResume) || applying}
              onClick={applyJobHandler}
              className="w-full sm:w-auto bg-[#0066FF] hover:bg-blue-700 text-white"
            >
              {applying ? "Applying..." : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default JobsDescription;