import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table, TableCaption, TableHead, TableHeader,
  TableRow, TableBody, TableCell,
} from "@/components/ui/table";
import {
  MoreHorizontal, FileText, Pencil, CalendarIcon, ArrowLeft,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDispatch, useSelector } from "react-redux";
import axios from "@/utils/axiosInstance";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { setApplications } from "@/redux/applicationSlice";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const emptyAcceptedForm = {
  interviewDate: "", interviewTime: "", interviewLocation: "",
  jobTime: "", startingFrom: "", contactEmail: "",
  contactNumber: "", moreMessage: "",
};

const AcceptanceFormFields = ({ acceptedForm, handleFormChange, setAcceptedForm }) => {
  const selectedInterviewDate = acceptedForm.interviewDate
    ? new Date(acceptedForm.interviewDate)
    : undefined;

  const fieldClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0066FF]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full justify-start text-left font-normal border-gray-300 h-10">
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {selectedInterviewDate ? format(selectedInterviewDate, "PPP") : "Pick a date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedInterviewDate}
              onSelect={(date) =>
                setAcceptedForm((prev) => ({
                  ...prev,
                  interviewDate: date ? format(date, "yyyy-MM-dd") : "",
                }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interview Time</label>
        <input type="time" name="interviewTime" value={acceptedForm.interviewTime} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Interview Location</label>
        <input type="text" name="interviewLocation" placeholder="Company office / online link / venue" value={acceptedForm.interviewLocation} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Time</label>
        <input type="text" name="jobTime" placeholder="9 AM - 5 PM" value={acceptedForm.jobTime} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Starting From</label>
        <input type="text" name="startingFrom" placeholder="2026-05-01 or Next Monday" value={acceptedForm.startingFrom} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
        <input type="email" name="contactEmail" placeholder="hr@company.com" value={acceptedForm.contactEmail} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
        <input type="text" name="contactNumber" placeholder="+977-98XXXXXXXX" value={acceptedForm.contactNumber} onChange={handleFormChange} className={fieldClass} />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">More Message</label>
        <textarea name="moreMessage" rows="4" placeholder="Add any additional message for the candidate..." value={acceptedForm.moreMessage} onChange={handleFormChange} className={`${fieldClass} resize-none`} />
      </div>
    </div>
  );
};

const ApplicantsTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicants } = useSelector((store) => store.applicationSlice);

  const [updatingId, setUpdatingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [acceptedForm, setAcceptedForm] = useState(emptyAcceptedForm);

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-700 border border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "Accepted";
      case "rejected": return "Rejected";
      default: return "Pending";
    }
  };

  const updateApplicantInStore = (updatedApplication) => {
    dispatch(setApplications(
      applicants.map((item) =>
        item._id === updatedApplication._id ? { ...item, ...updatedApplication } : item
      )
    ));
  };

  const openAcceptDialog = (item) => {
    setSelectedApplicant(item);
    setAcceptedForm({
      interviewDate: item?.acceptedDetails?.interviewDate || "",
      interviewTime: item?.acceptedDetails?.interviewTime || "",
      interviewLocation: item?.acceptedDetails?.interviewLocation || "",
      jobTime: item?.acceptedDetails?.jobTime || "",
      startingFrom: item?.acceptedDetails?.startingFrom || "",
      contactEmail: item?.acceptedDetails?.contactEmail || "",
      contactNumber: item?.acceptedDetails?.contactNumber || "",
      moreMessage: item?.acceptedDetails?.moreMessage || "",
    });
    setDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAcceptedForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReject = async (id) => {
    try {
      setUpdatingId(id);
      const res = await axios.post(`${APPLICATION_API_END_POINT}/update-application-status/${id}`, { status: "rejected" });
      if (res.data.success) { updateApplicantInStore(res.data.application); toast.success(res.data.message); }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAcceptSubmit = async () => {
    if (!selectedApplicant?._id) return;
    try {
      setUpdatingId(selectedApplicant._id);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/update-application-status/${selectedApplicant._id}`,
        { status: "accepted", acceptedDetails: acceptedForm }
      );
      if (res.data.success) {
        updateApplicantInStore(res.data.application);
        toast.success(res.data.message);
        setDialogOpen(false);
        setSelectedApplicant(null);
        setAcceptedForm(emptyAcceptedForm);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const actionButtonClass = (currentStatus, buttonStatus) => {
    const isActive = currentStatus?.toLowerCase() === buttonStatus.toLowerCase();
    if (buttonStatus === "accepted") {
      return isActive
        ? "justify-start bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 hover:text-green-700"
        : "justify-start text-green-700 border border-transparent hover:text-green-700 hover:bg-transparent";
    }
    return isActive
      ? "justify-start bg-red-100 text-red-700 border border-red-200 hover:bg-red-100 hover:text-red-700"
      : "justify-start text-red-700 border border-transparent hover:text-red-700 hover:bg-transparent";
  };

  const dialogTitle = useMemo(() => (
    selectedApplicant?.status === "accepted" ? "Update Acceptance Details" : "Send Acceptance Details"
  ), [selectedApplicant]);

  if (!applicants || applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium text-sm">No applicants yet</p>
        <p className="text-gray-400 text-xs mt-1">Applicants will appear here once people apply</p>
      </div>
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {applicants.map((item) => (
          <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">

            {/* Top row: name + status */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">{item?.applicant?.fullName || "N/A"}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{item?.applicant?.email || "N/A"}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusClasses(item?.status || "pending")}`}>
                {getStatusLabel(item?.status)}
              </span>
            </div>

            {/* Info rows */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
              <div>
                <p className="text-gray-400 font-medium">Contact</p>
                <p className="text-gray-700 font-medium truncate">{item?.applicant?.phoneNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Applied</p>
                <p className="text-gray-700 font-medium">{item?.createdAt?.split("T")[0] || "N/A"}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {item?.resume?.url ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-9"
                  onClick={() => window.open(item?.resume?.url, "_blank")}
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> View CV
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg h-9">
                  No CV
                </div>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-9">
                    <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" /> Actions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={actionButtonClass(item?.status, "accepted")}
                      disabled={updatingId === item._id}
                      onClick={() => openAcceptDialog(item)}
                    >
                      Accept
                    </Button>
                    {item?.status === "accepted" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-[#0066FF] hover:text-[#0066FF] hover:bg-blue-50"
                        onClick={() => openAcceptDialog(item)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Update Details
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={actionButtonClass(item?.status, "rejected")}
                      disabled={updatingId === item._id}
                      onClick={() => handleReject(item._id)}
                    >
                      Reject
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <Table>
          <TableCaption>List of all applicants for this job</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item?.applicant?.fullName || "N/A"}</TableCell>
                <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                <TableCell>
                  {item?.resume?.url ? (
                    <Button variant="outline" size="sm" onClick={() => window.open(item?.resume?.url, "_blank")}>
                      View CV
                    </Button>
                  ) : "No CV"}
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(item?.status || "pending")}`}>
                    {getStatusLabel(item?.status)}
                  </span>
                </TableCell>
                <TableCell>{item?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-2">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          className={actionButtonClass(item?.status, "accepted")}
                          disabled={updatingId === item._id}
                          onClick={() => openAcceptDialog(item)}
                        >
                          Accept
                        </Button>
                        {item?.status === "accepted" && (
                          <Button
                            variant="ghost"
                            className="justify-start text-[#0066FF] hover:text-[#0066FF] hover:bg-blue-50"
                            onClick={() => openAcceptDialog(item)}
                          >
                            <Pencil className="h-4 w-4 mr-2" /> Update Details
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className={actionButtonClass(item?.status, "rejected")}
                          disabled={updatingId === item._id}
                          onClick={() => handleReject(item._id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Accept dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-base sm:text-lg">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Fill the details that will be emailed to the accepted candidate.
            </DialogDescription>
          </DialogHeader>

          <AcceptanceFormFields
            acceptedForm={acceptedForm}
            handleFormChange={handleFormChange}
            setAcceptedForm={setAcceptedForm}
          />

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-[#0066FF] hover:bg-blue-700 text-white"
              disabled={updatingId === selectedApplicant?._id}
              onClick={handleAcceptSubmit}
            >
              {selectedApplicant?.status === "accepted" ? "Update & Send Email" : "Accept & Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantsTable;