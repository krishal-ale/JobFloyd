import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Label } from "./ui/label";
import { Dialog } from "./ui/dialog";
import React from "react";
import { DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { DialogDescription } from "./ui/dialog";

const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setloading] = useState(false);
  const { user } = useSelector((store) => store.authSlice);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: user?.profile?.resume || null,
  });

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
  e.preventDefault();
  setloading(true);
  
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  formData.append("email", input.email);
  formData.append("phoneNumber", input.phoneNumber);
  formData.append("bio", input.bio);
  formData.append("skills", input.skills);
  if (input.file) {
    formData.append("file", input.file);
  }

  try {
    const res = await axios.post(
      `${USER_API_END_POINT}/update-profile`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    if (res.data.success) {
      dispatch(setUser(res.data.responseUser));
      toast.success(res.data.message);
      setOpen(false); // ✅ Only close on success
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Status:", error.response?.status);       
    console.error("Error data:", error.response?.data);     
    console.error("Message:", error.message);               
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    setloading(false); 
  }
};
  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Update <span className="text-[#0066FF]">Profile</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 mt-1">
              Update your personal information below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="fullName"
                  type="text"
                  value={input.fullName}
                  onChange={onChangeHandler}
                  placeholder="Enter your full name"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={input.email}
                  onChange={onChangeHandler}
                  placeholder="Enter your email"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="number"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <Input
                  id="number"
                  name="phoneNumber"
                  type="text"
                  value={input.phoneNumber}
                  onChange={onChangeHandler}
                  placeholder="Enter your phone number"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio
                </Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  value={input.bio}
                  onChange={onChangeHandler}
                  placeholder="Write a short bio"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="skills"
                  className="text-sm font-medium text-gray-700"
                >
                  Skills
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  value={input.skills}
                  onChange={onChangeHandler}
                  placeholder="e.g. React, Node.js, Python"
                  className="rounded-xl border-gray-200 focus:border-[#0066FF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="file"
                  className="text-sm font-medium text-gray-700"
                >
                  Resume
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  onChange={fileChangeHandler}
                  className="rounded-xl border-gray-200 text-sm text-gray-500"
                />
              </div>
            </div>

            <DialogFooter>
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-[#0066FF] text-white font-medium py-2 rounded-xl cursor-not-allowed"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium py-2 rounded-xl"
                >
                  Update Profile
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfile;
