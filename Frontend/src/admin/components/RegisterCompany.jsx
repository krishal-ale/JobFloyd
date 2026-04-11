import NavBar from "@/components/shared/NavBar";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setMyCompany } from "@/redux/companySlice";
import { Building2, Loader2 } from "lucide-react";

const RegisterCompany = () => {
    const [noPan, setNoPan] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        industry: "",
        location: "",
        pan_vat_num: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

    const registerCompany = async () => {
        setLoading(true);
        try {
            const payload = noPan ? { noPan: true } : { ...input };
            const res = await axios.post(`${COMPANY_API_END_POINT}/company-register`, payload, { withCredentials: true });
            if (res.data.success) {
                dispatch(setMyCompany(res.data.company));
                toast.success(res.data.message);
                navigate("/admin/company");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <NavBar />
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                            <Building2 className="h-8 w-8 text-[#0066FF]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Register Your <span className="text-[#0066FF]">Company</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">
                            Fill in your details. Adding a PAN/VAT number gives your company a verified badge.
                        </p>
                    </div>

                    {/* No PAN toggle */}
                    <div
                        className="flex items-start gap-3 mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl cursor-pointer"
                        onClick={() => setNoPan(!noPan)}
                    >
                        <input
                            type="checkbox"
                            checked={noPan}
                            onChange={() => setNoPan(!noPan)}
                            className="accent-[#0066FF] mt-0.5"
                            id="noPan"
                        />
                        <label htmlFor="noPan" className="text-sm text-yellow-700 cursor-pointer leading-relaxed">
                            I don't have a PAN number or registered company —{" "}
                            <strong>register as Unknown Company</strong> (can be updated later)
                        </label>
                    </div>

                    {/* Form — disabled when noPan is checked */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 transition-opacity duration-200 ${noPan ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">
                                Company Name <span className="text-red-400">*</span>
                            </Label>
                            <Input name="name" value={input.name} onChange={changeHandler} placeholder="e.g. Google" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">
                                PAN / VAT Number{" "}
                                <span className="text-[#0066FF] text-xs font-normal">(required for verification)</span>
                            </Label>
                            <Input name="pan_vat_num" value={input.pan_vat_num} onChange={changeHandler} placeholder="e.g. 123456789" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">Industry</Label>
                            <Input name="industry" value={input.industry} onChange={changeHandler} placeholder="e.g. Technology" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">Location</Label>
                            <Input name="location" value={input.location} onChange={changeHandler} placeholder="e.g. Kathmandu, Nepal" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">Website</Label>
                            <Input name="website" value={input.website} onChange={changeHandler} placeholder="https://yourcompany.com" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                            <Input name="description" value={input.description} onChange={changeHandler} placeholder="Short company description" className="rounded-xl border-gray-200 text-sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("/admin/company")}
                            variant="outline"
                            className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF]"
                        >
                            Cancel
                        </Button>
                        {loading ? (
                            <Button disabled className="flex-1 bg-[#0066FF] text-white rounded-xl">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                            </Button>
                        ) : (
                            <Button onClick={registerCompany} className="flex-1 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl">
                                Register
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;