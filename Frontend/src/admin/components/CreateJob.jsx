import NavBar from "@/components/shared/NavBar";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Select, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SelectContent, SelectItem } from "@/components/ui/select";
import {toast} from "react-toastify";
import { Loader2 } from "lucide-react";


const CreateJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  naviagte = useNavigate();

  const [loading, setLoading] = useState(false);

  const {companies} = useSelector(store=>store.companySlice);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(company => company._id === value);
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await axios.post(
      `${JOB_API_END_POINT}/create-job`,
      input,
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      Navigate("/admin/jobs");
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.log(err);
    toast.error(err?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center w-screen my-5">
        <form action="" className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Experience</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Number of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
{
  companies.length <= 0 && (
    <Select onValueChange={selectChangeHandler}>
      <SelectTrigger>
        <SelectValue placeholder="Select Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            companies.map((company) => (
              <SelectItem key={company._id} value={company._id}>
                {company.name}
              </SelectItem>
             )
            )
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
          </div>

          
          {loading ? (  
              <Button disabled className="w-full bg-[#0066FF] text-white rounded-xl cursor-not-allowed">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </Button>
            ) : (
              <Button className="w-full mt-4 ">Post New Job</Button>
            )}
          {
           companies.length === 0 && <p className="text-sm text-gray-500 mt-2">No companies available. Please add a company first.</p>
          }
        </form>
      </div> 
    </div>
  );
};

export default CreateJob;
