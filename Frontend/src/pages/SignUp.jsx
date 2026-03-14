import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-Group";
import { Link } from "react-router-dom";



const SignUp = () => {
  return (
    <div>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          action=""
          className="w-1/2 border-3 border-gray-200 shadow-lg focus-within:border-blue-400 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-6">Sign Up</h1>
          <div className="my-3">
            <Label className="my-2">Full Name</Label>
            <Input type="text" placeholder="Enter your Name" />
          </div>
          <div className="my-3">
            <Label className="my-2">Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          <div className="my-3">
            <Label className="my-2">Phone Number</Label>
            <Input type="text" placeholder="Enter your phone number" />
          </div>
          <div className="my-3">
            <Label className="my-2">Password</Label>
            <Input type="password" placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup defaultValue="job-seeker" className="flex items-center gap-3 my-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="job-seeker" id="job-seeker" />
                <Label htmlFor="job-seeker">Job Seeker</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
               <Label>Profile Picture</Label>
                <Input type="file" accept="image/*" className="cursor-pointer" />
            </div>
          </div>
          <Button type="submit" className="w-full my-4 cursor-pointer hover:bg-blue-800">Sign Up</Button>
          <span className="block text-center">Already have an account? <Link to="/login" className="text-blue-800 hover:underline">Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
