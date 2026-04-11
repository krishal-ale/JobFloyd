import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import JobsTable from "../components/JobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import useGetMyCompany from "@/hooks/useGetAllCompanies";


const AdminJobs = () => {
    useGetAllAdminJobs();
    useGetMyCompany();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myCompany } = useSelector(store => store.companySlice);
    const [input, setInput] = useState("");

    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <NavBar />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin <span className="text-[#0066FF]">Jobs</span></h1>
                    <p className="text-sm text-gray-400 mt-1">Manage all your posted jobs</p>
                </div>

                {!myCompany ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
                        <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                            <Building2 className="h-10 w-10 text-[#0066FF]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Company Registered</h2>
                        <p className="text-sm text-gray-400 mb-6 max-w-sm">
                            You need to register your company before you can post jobs.
                        </p>
                        <Button
                            onClick={() => navigate("/admin/company/register")}
                            className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl px-6"
                        >
                            Register Now
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white w-full sm:w-72">
                                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                                <Input
                                    className="border-none shadow-none focus-visible:ring-0 text-sm p-0 h-auto"
                                    placeholder="Filter by job title"
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                />
                            </div>
                            <Button
                                className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl px-5 flex items-center gap-2 shrink-0 w-full sm:w-auto"
                                onClick={() => navigate("/admin/jobs/create")}
                            >
                                <Plus className="h-4 w-4" /> Post New Job
                            </Button>
                        </div>
                        <JobsTable />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminJobs;