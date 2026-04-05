import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {


    const params = useParams();

  useGetCompanyById(params.id);

  const companyId = params.id;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null
  });

  const { singleCompany } = useSelector(store => store.company);
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setInput({...input, [e.target.name]: e.target.value})
  }

  const onFileChangeHandler = (e) => {
    setInput({...input, file: e.target.files[0]})
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if(input.file){
      formData.append("file", input.file);
    }
    setLoading(true);
    try {
      const res = await axios.put(`${COMPANY_API_END_POINT}/update-company/${companyId}`, formData, {
        withCredentials: true,
      });
      if(res.data.success){
        toast.success(res.data.message);
        navigate("/admin/company");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInput({
      name: singleCompany?.name || "",
      description: singleCompany?.description || "",
      website: singleCompany?.website || "",
      location: singleCompany?.location || "",
    })
  }, [singleCompany])

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-10">

        
        <div className="flex items-center gap-3 mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/company")}
            className="rounded-xl border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Company <span className="text-[#0066FF]">Setup</span>
            </h1>
            <p className="text-xs text-gray-400">Update your company details below</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

          <form onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                <Input
                  name="name"
                  value={input.name}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="e.g. Google"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF] text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Short company description"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF] text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">Website</Label>
                <Input
                  name="website"
                  value={input.website}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="https://yourcompany.com"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF] text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  name="location"
                  value={input.location}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="e.g. Kathmandu, Nepal"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF] text-sm"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Company Logo</Label>
                <Input
                  name="file"
                  accept="image/*"
                  onChange={onFileChangeHandler}
                  type="file"
                  className="rounded-xl border-gray-200 text-sm text-gray-500"
                />
              </div>

            </div>

            {loading ? (
              <Button disabled className="w-full bg-[#0066FF] text-white rounded-xl cursor-not-allowed">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl">
                Update Company
              </Button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;