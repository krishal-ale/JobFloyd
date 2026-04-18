import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import axios from "@/utils/axiosInstance";
import { SUPER_ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2, BadgeCheck, AlertTriangle, Trash2,
  ChevronDown, ChevronUp, Users, Briefcase,
} from "lucide-react";

const SAEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmployer, setExpandedEmployer] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", id: "", label: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const res = await axios.get(`${SUPER_ADMIN_API_END_POINT}/employers`);
      if (res.data.success) setEmployers(res.data.employers);
    } catch (error) {
      toast.error("Failed to load employers");
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
      if (type === "deleteEmployer") {
        await axios.delete(`${SUPER_ADMIN_API_END_POINT}/employer/${id}`);
        setEmployers((prev) => prev.filter((e) => e._id !== id));
        toast.success("Employer deleted");
      } else if (type === "deleteJob") {
        await axios.delete(`${SUPER_ADMIN_API_END_POINT}/job/${id}`);
        setEmployers((prev) =>
          prev.map((e) => ({ ...e, jobs: e.jobs.filter((j) => j._id !== id) }))
        );
        toast.success("Job deleted");
      } else if (type === "deleteApplication") {
        await axios.delete(`${SUPER_ADMIN_API_END_POINT}/application/${id}`);
        toast.success("Application deleted");
        fetchEmployers();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, type: "", id: "", label: "" });
    }
  };

  const handleToggleVerify = async (companyId) => {
    try {
      const res = await axios.patch(
        `${SUPER_ADMIN_API_END_POINT}/company/${companyId}/toggle-verify`
      );
      if (res.data.success) {
        setEmployers((prev) =>
          prev.map((e) =>
            e.company?._id === companyId
              ? { ...e, company: { ...e.company, isVerified: res.data.isVerified } }
              : e
          )
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update verification");
    }
  };

  const toggleExpand = (id) => {
    setExpandedEmployer((prev) => (prev === id ? null : id));
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
            Employers <span className="text-[#0066FF]">Management</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {employers.length} employer{employers.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        {employers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No employers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {employers.map((employer) => (
              <div
                key={employer._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Employer Row */}
                <div className="p-4 sm:p-5">
                  {/* Mobile Card */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 shrink-0">
                          <AvatarImage
                            src={employer.profile?.profilePicture}
                            alt={employer.fullName}
                          />
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{employer.fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{employer.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => openConfirm("deleteEmployer", employer._id, employer.fullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="font-medium text-gray-700">Phone:</span> {employer.phoneNumber}</p>
                      <p><span className="font-medium text-gray-700">Joined:</span> {employer.createdAt?.split("T")[0]}</p>
                    </div>

                    {employer.company && (
                      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={employer.company.logo} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{employer.company.name}</p>
                            <span className={`text-xs flex items-center gap-1 ${employer.company.isVerified ? "text-[#0066FF]" : "text-yellow-600"}`}>
                              {employer.company.isVerified
                                ? <><BadgeCheck className="h-3 w-3" />Verified</>
                                : <><AlertTriangle className="h-3 w-3" />Unverified</>}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs shrink-0 ${employer.company.isVerified ? "border-red-200 text-red-500 hover:bg-red-50" : "border-blue-200 text-[#0066FF] hover:bg-blue-50"}`}
                          onClick={() => handleToggleVerify(employer.company._id)}
                        >
                          {employer.company.isVerified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> {employer.jobsCount} jobs
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {employer.applicantsCount} applicants
                        </span>
                      </div>
                      {employer.jobs?.length > 0 && (
                        <button
                          className="text-xs text-[#0066FF] flex items-center gap-1"
                          onClick={() => toggleExpand(employer._id)}
                        >
                          {expandedEmployer === employer._id ? <><ChevronUp className="h-3.5 w-3.5" />Hide Jobs</> : <><ChevronDown className="h-3.5 w-3.5" />View Jobs</>}
                        </button>
                      )}
                    </div>
                  </div>

                 
                  <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 ring-2 ring-blue-100 shrink-0">
                        <AvatarImage src={employer.profile?.profilePicture} />
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{employer.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{employer.email}</p>
                        <p className="text-xs text-gray-400">{employer.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      {employer.company ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={employer.company.logo} />
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{employer.company.name}</p>
                            <span className={`text-xs flex items-center gap-1 ${employer.company.isVerified ? "text-[#0066FF]" : "text-yellow-600"}`}>
                              {employer.company.isVerified
                                ? <><BadgeCheck className="h-3 w-3" />Verified</>
                                : <><AlertTriangle className="h-3 w-3" />Unverified</>}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No company</span>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 text-center">
                      <span className="font-semibold text-gray-900">{employer.jobsCount}</span>
                      <p className="text-xs text-gray-400">jobs</p>
                    </div>

                    <div className="text-sm text-gray-700 text-center">
                      <span className="font-semibold text-gray-900">{employer.applicantsCount}</span>
                      <p className="text-xs text-gray-400">applicants</p>
                    </div>

                    <div>
                      {employer.company && (
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs ${employer.company.isVerified ? "border-red-200 text-red-500 hover:bg-red-50" : "border-blue-200 text-[#0066FF] hover:bg-blue-50"}`}
                          onClick={() => handleToggleVerify(employer.company._id)}
                        >
                          {employer.company.isVerified ? "Unverify" : "Verify"}
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {employer.jobs?.length > 0 && (
                        <button
                          className="text-xs text-[#0066FF] flex items-center gap-1 hover:underline"
                          onClick={() => toggleExpand(employer._id)}
                        >
                          {expandedEmployer === employer._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => openConfirm("deleteEmployer", employer._id, employer.fullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

               
                {expandedEmployer === employer._id && employer.jobs?.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Jobs Posted
                    </p>
                    <div className="space-y-2">
                      {employer.jobs.map((job) => (
                        <div
                          key={job._id}
                          className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                              <p className="text-xs text-gray-400">{job.location} · {job.jobType} · {job.createdAt?.split("T")[0]}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {job.applications?.length || 0} application(s)
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-50 shrink-0"
                              onClick={() => openConfirm("deleteJob", job._id, job.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

export default SAEmployers;