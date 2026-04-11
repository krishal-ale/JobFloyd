import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import React from "react";
import { Building2, Edit2, BadgeCheck, MapPin, Globe, Briefcase, Hash, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetMyCompany from "@/hooks/useGetAllCompanies";

const AdminCompany = () => {
    useGetMyCompany();
    const navigate = useNavigate();
    const { myCompany } = useSelector(store => store.companySlice);

    return (
        <div className="bg-gray-50 min-h-screen">
            <NavBar />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My <span className="text-[#0066FF]">Company</span></h1>
                    <p className="text-sm text-gray-400 mt-1">Manage your registered company</p>
                </div>

                {!myCompany ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
                        <div className="bg-blue-50 p-4 rounded-2xl mb-4">
                            <Building2 className="h-10 w-10 text-[#0066FF]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Company Registered</h2>
                        <p className="text-sm text-gray-400 mb-6 max-w-sm">
                            You haven't registered your company yet. Register to start posting jobs and reaching top talent.
                        </p>
                        <Button
                            onClick={() => navigate("/admin/company/register")}
                            className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl px-6 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Register Company
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                {myCompany.logo ? (
                                    <img src={myCompany.logo} alt="logo" className="h-16 w-16 rounded-xl object-cover border border-gray-100" />
                                ) : (
                                    <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Building2 className="h-8 w-8 text-[#0066FF]" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900">{myCompany.name}</h2>
                                        {myCompany.isVerified && (
                                            <BadgeCheck className="h-5 w-5 text-[#0066FF]" title="Verified Company" />
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1 ${
                                        myCompany.isVerified
                                            ? 'bg-blue-50 text-[#0066FF]'
                                            : 'bg-yellow-50 text-yellow-600'
                                    }`}>
                                        {myCompany.isVerified
                                            ? <><CheckCircle className="h-3 w-3" /> Verified Company</>
                                            : <><AlertTriangle className="h-3 w-3" /> Unverified — Add PAN to verify</>
                                        }
                                    </span>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(`/admin/company/${myCompany._id}`)}
                                variant="outline"
                                className="rounded-xl border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] flex items-center gap-2"
                            >
                                <Edit2 className="h-4 w-4" /> Edit
                            </Button>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myCompany.description && (
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Description</span>
                                    <span className="text-sm text-gray-700">{myCompany.description}</span>
                                </div>
                            )}
                            {myCompany.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#0066FF] shrink-0" />
                                    <span className="text-sm text-gray-700">{myCompany.location}</span>
                                </div>
                            )}
                            {myCompany.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-[#0066FF] shrink-0" />
                                    <a href={myCompany.website} target="_blank" rel="noreferrer" className="text-sm text-[#0066FF] hover:underline truncate">
                                        {myCompany.website}
                                    </a>
                                </div>
                            )}
                            {myCompany.industry && (
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-[#0066FF] shrink-0" />
                                    <span className="text-sm text-gray-700">{myCompany.industry}</span>
                                </div>
                            )}
                            {myCompany.pan_vat_num && (
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-[#0066FF] shrink-0" />
                                    <span className="text-sm text-gray-700">PAN/VAT: {myCompany.pan_vat_num}</span>
                                </div>
                            )}
                        </div>

                        {!myCompany.isVerified && (
                            <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-700 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>Your company is not verified. Click <strong>Edit</strong> and add your PAN/VAT number to get verified.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCompany;