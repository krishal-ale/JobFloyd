import NavBar from "@/components/shared/NavBar";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useGetMyCompany from "@/hooks/useGetAllCompanies";

const CreateJob = () => {
  useGetMyCompany();
  const { myCompany } = useSelector((store) => store.companySlice);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!myCompany) {
      toast.error("Please register your company first.");
      navigate("/admin/company/register");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${JOB_API_END_POINT}/create-job`,
        {
          ...input,
          companyId: myCompany._id,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Post a <span className="text-[#0066FF]">New Job</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Fill in the details for your job listing
          </p>
          {myCompany && (
            <p className="text-xs text-[#0066FF] mt-1">
              Posting for: <strong>{myCompany.name}</strong>
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Job Title
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  placeholder="e.g. Frontend Developer"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Brief job description"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Requirements
                </Label>
                <Input
                  type="text"
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="e.g. React, Node.js"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Salary
                </Label>
                <Input
                  type="text"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  placeholder="e.g. 50000"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="e.g. Kathmandu"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Job Type
                </Label>
                <Input
                  type="text"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  placeholder="e.g. Full-time"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Experience (years)
                </Label>
                <Input
                  type="text"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  placeholder="e.g. 2"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">
                  Number of Positions
                </Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="e.g. 3"
                  className="rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#0066FF]"
                />
              </div>
            </div>

            {loading ? (
              <Button
                disabled
                className="w-full bg-[#0066FF] text-white rounded-xl cursor-not-allowed hover:bg-[#0066FF]"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl"
              >
                Post Job
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;