import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableBody, TableCaption, TableHead, TableHeader, TableRow, Table, TableCell } from "@/components/ui/table";
import React, { useEffect } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PopoverContent, Popover, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal, Edit2, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { all } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import JobsTable from "../components/JobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";


const AdminJobs = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const dispatch = useDispatch();

const [input, setInput] = useState("");


useEffect(() => {
   dispatch(setSearchJobByText(input));

},[input]);



return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-10">

       
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin <span className="text-[#0066FF]">Companies</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage all registered companies</p>
        </div>

        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white w-full sm:w-72">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <Input className="border-none shadow-none focus-visible:ring-0 text-sm p-0 h-auto" placeholder="Filter by job title or company name" onChange={(e) => setInput(e.target.value)} value={input}/>
          </div>
          <Button className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl px-5 flex items-center gap-2 shrink-0 w-full sm:w-auto" onClick={() => navigate("/admin/jobs/create")}>
            <Plus className="h-4 w-4" /> Post New Jobs
          </Button>
        </div>

        <JobsTable/>
       

      </div>
    </div>
  );
};

export default AdminJobs;