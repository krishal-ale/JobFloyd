import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, Edit2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";


const JobsTable = () => {
  const { allAdminJobs = [], searchJobByText } = useSelector(
    (store) => store.jobSlice,
  );
  const navigate = useNavigate();
  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase()) ||
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filtered);
  }, [JSON.stringify(allAdminJobs), searchJobByText]);

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="text-xs text-gray-400 mb-3">
            List of all posted Jobs
          </TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Company Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Role
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#0066FF] uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {filterJobs.length === 0 ? (
    <TableRow>
      <TableCell
        colSpan={4}
        className="text-center text-gray-400 text-sm py-10"
      >
        No jobs found
      </TableCell>
    </TableRow>
  ) : (
    filterJobs.map((job) => (
      <TableRow
        key={job._id}
        className="hover:bg-blue-50 transition-colors duration-150"
      >
        {/* ✅ Company Name + Logo */}
        <TableCell className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-blue-100">
            <AvatarImage src={job.company?.logo} />
          </Avatar>
          <span className="text-sm font-medium text-gray-800">
            {job.company?.name || "N/A"}
          </span>
        </TableCell>

        {/* ✅ Role */}
        <TableCell className="text-sm font-medium text-gray-800">
          {job.title || "N/A"}
        </TableCell>

        {/* ✅ Date */}
        <TableCell className="text-sm text-gray-400">
          {job.createdAt?.split("T")[0]}
        </TableCell>

        {/* ✅ Actions */}
        <TableCell>
          <Popover>
            <PopoverTrigger className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2 rounded-xl shadow-md border border-gray-100">
              <div
                onClick={() => navigate(`/admin/jobs/${job._id}`)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0066FF] cursor-pointer transition-colors text-sm"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </div>
              <div
                onClick={() =>
                  navigate(`/admin/jobs/${job._id}/applicants`)
                }
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0066FF] cursor-pointer transition-colors text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>Applicants</span>
              </div>
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobsTable;
