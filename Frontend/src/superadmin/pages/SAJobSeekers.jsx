import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import axios from "@/utils/axiosInstance";
import { SUPER_ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Users, Trash2, ChevronDown, ChevronUp, FileText,
} from "lucide-react";

const SAJobSeekers = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeeker, setExpandedSeeker] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", id: "", label: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const res = await axios.get(`${SUPER_ADMIN_API_END_POINT}/jobseekers`);
      if (res.data.success) setJobSeekers(res.data.jobSeekers);
    } catch (error) {
      toast.error("Failed to load job seekers");
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (type, id, label) => {
    setConfirmDialog({ open: true, type, id, label });
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    const { type, id } = confirmDialog;
    try {
      if (type === "deleteSeeker") {
        await axios.delete(`${SUPER_ADMIN_API_END_POINT}/jobseeker/${id}`);
        setJobSeekers((prev) => prev.filter((s) => s._id !== id));
        toast.success("Job seeker deleted");
      } else if (type === "deleteApplication") {
        await axios.delete(`${SUPER_ADMIN_API_END_POINT}/application/${id}`);
        toast.success("Application deleted");
        fetchJobSeekers();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, type: "", id: "", label: "" });
    }
  };

  const toggleExpand = (id) => {
    setExpandedSeeker((prev) => (prev === id ? null : id));
  };

  const statusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Job Seekers <span className="text-[#0066FF]">Management</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {jobSeekers.length} job seeker{jobSeekers.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        {jobSeekers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No job seekers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobSeekers.map((seeker) => (
              <div
                key={seeker._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  {/* Mobile Card */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 shrink-0">
                          <AvatarImage src={seeker.profile?.profilePicture} />
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{seeker.fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{seeker.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => openConfirm("deleteSeeker", seeker._id, seeker.fullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium text-gray-700">Phone:</span> {seeker.phoneNumber}</p>
                      <p><span className="font-medium text-gray-700">Joined:</span> {seeker.createdAt?.split("T")[0]}</p>
                      <p><span className="font-medium text-gray-700">Applications:</span> {seeker.applications?.length || 0}</p>
                    </div>

                    {seeker.applications?.length > 0 && (
                      <button
                        className="text-xs text-[#0066FF] flex items-center gap-1"
                        onClick={() => toggleExpand(seeker._id)}
                      >
                        {expandedSeeker === seeker._id
                          ? <><ChevronUp className="h-3.5 w-3.5" />Hide Applications</>
                          : <><ChevronDown className="h-3.5 w-3.5" />View Applications</>}
                      </button>
                    )}
                  </div>

                  {/* Desktop Row */}
                  <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 ring-2 ring-blue-100 shrink-0">
                        <AvatarImage src={seeker.profile?.profilePicture} />
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{seeker.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{seeker.email}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>{seeker.phoneNumber}</p>
                      <p className="text-xs text-gray-400">Joined: {seeker.createdAt?.split("T")[0]}</p>
                    </div>

                    <div className="text-center">
                      <span className="font-semibold text-gray-900">{seeker.applications?.length || 0}</span>
                      <p className="text-xs text-gray-400">applications</p>
                    </div>

                    <div>
                      {seeker.applications?.length > 0 && (
                        <button
                          className="text-xs text-[#0066FF] flex items-center gap-1 hover:underline"
                          onClick={() => toggleExpand(seeker._id)}
                        >
                          {expandedSeeker === seeker._id
                            ? <><ChevronUp className="h-4 w-4" />Hide</>
                            : <><ChevronDown className="h-4 w-4" />View</>}
                        </button>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => openConfirm("deleteSeeker", seeker._id, seeker.fullName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {expandedSeeker === seeker._id && seeker.applications?.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Applications
                    </p>
                    <div className="space-y-2">
                      {seeker.applications.map((app) => (
                        <div
                          key={app._id}
                          className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {app.job?.title || "Job Deleted"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {app.job?.location} · {app.job?.jobType}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClasses(app.status)}`}>
                                  {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || "Pending"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {app.createdAt?.split("T")[0]}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {app.resume?.url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => window.open(app.resume.url, "_blank")}
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />CV
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => openConfirm("deleteApplication", app._id, `application for ${app.job?.title || "this job"}`)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{confirmDialog.label}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, type: "", id: "", label: "" })}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={actionLoading}
              onClick={handleConfirm}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SAJobSeekers;