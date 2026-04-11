import NavBar from "@/components/shared/NavBar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { use, useState } from "react";
import { Contact, Pen, Mail, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppliedJobs from "@/components/AppliedJobs";
import Footer from "@/components/shared/Footer";
import UpdateProfile from "../components/UpdateProfile";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";


const Profile = () => {

  useGetAppliedJobs();

  const [open, setOpen] = useState(false);
  const {user} = useSelector(store=>store.authSlice);


  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 mb-6">

          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-2 ring-blue-100">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              </Avatar>
              <div>
                <h1 className="font-bold text-xl text-gray-900">{user?.fullName}</h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  {user?.profile?.bio}
                </p>
              </div>
            </div>
            <Button variant="outline" className="self-start sm:self-auto border-[#0066FF] text-[#0066FF] hover:bg-blue-50 flex items-center gap-2 rounded-full px-5" onClick={()=>{setOpen(!open)}}>
              <Pen className="h-4 w-4" /> Edit Profile
            </Button>
          </div>

          <hr className="border-gray-100 mb-5" />

          {/* Contact info */}
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-[#0066FF] shrink-0" />
              {user?.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Contact className="h-4 w-4 text-[#0066FF] shrink-0" />
              {user?.phoneNumber}
            </div>
          </div>

          <hr className="border-gray-100 mb-5" />

          {/* Skills */}
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-[#0066FF] uppercase tracking-wide mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {user?.profile?.skills.length > 0 ? (
                user?.profile?.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-[#0066FF] text-[#0066FF] bg-blue-50 rounded-full px-3 py-1 text-xs font-medium">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">No skills added</span>
              )}
            </div>
          </div>

          <hr className="border-gray-100 mb-5" />

          {/* Resume */}
          <div>
            <h2 className="text-sm font-semibold text-[#0066FF] uppercase tracking-wide mb-3">
              Resume
            </h2>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              {user?.profile?.resume? (
                <a href={user?.profile?.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0066FF] underline underline-offset-4 hover:text-blue-700">
                  {user?.profile?.resumeName}
                </a>
              ) : (
                <span className="text-sm text-gray-400">No resume uploaded</span>
              )}
            </div>
          </div>

        </div>

        {/* Applied Jobs */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-5">
            Applied <span className="text-[#0066FF]">Jobs</span>
          </h1>
          <AppliedJobs />
        </div>
         <UpdateProfile open={open} setOpen={setOpen}/>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;