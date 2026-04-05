import NavBar from "@/components/shared/NavBar";
import { Input } from "@/components/ui/input";
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { Building2 } from "lucide-react";

const RegisterCompany = () => {
  const [companyName, setCompanyName] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/company-register`,
        { name: companyName },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res.data.company._id;
        navigate(`/admin/company/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-xl mx-auto px-4 py-16">

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

          {/* Icon + Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl mb-4">
              <Building2 className="h-8 w-8 text-[#0066FF]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Register Your <span className="text-[#0066FF]">Company</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              What would you like to name your company? You can change this at any time.
            </p>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2 mb-8">
            <Label className="text-sm font-medium text-gray-700">Company Name</Label>
            <Input
              placeholder="e.g. Google, Microsoft..."
              className="rounded-xl border-gray-200 focus:border-[#0066FF] text-sm"
              type="text"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/admin/company")}
              variant="outline"
              className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF]"
            >
              Cancel
            </Button>
            <Button
              onClick={registerCompany}
              className="flex-1 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl"
            >
              Register
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;