import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/shared/NavBar";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/authSlice";import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { setUser } from "@/redux/authSlice";



const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const {loading} = useSelector((state) => state.authSlice);

  const dispatch = useDispatch();

  const navigate = useNavigate();


  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e)=>{
    e.preventDefault();

    try{
      dispatch(setLoading(true));
       const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        
        withCredentials: true,
       });
      if(res.data.success){
        dispatch(setUser(res.data.responseUser));
        navigate("/");
        toast.success(res.data.message);
        
      }else{
        toast.error(res.data.message);
      }
    } catch(error){
      console.error("Error during sign up:", error);
      toast.error(error.response?.data?.message || "Sign up failed. Please try again.");
    } finally{
      dispatch(setLoading(false));
    }
  }


  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-xl p-5 sm:p-8 hover:border-[#0066FF] transition-colors focus-within:border-[#0066FF]"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
            <p className="text-sm text-gray-400 mt-1 text-center">
              Login to Job<span className="text-[#0066FF] font-bold">Floyd</span>
            </p>
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</Label>
            <Input
              type="email"
              placeholder="ram@example.com"
              className="w-full"
              name="email"
              value={input.email}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-5">
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="w-full"
              name="password"
              value={input.password}
              onChange={onChangeHandler}
            />
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">I am a</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="jobseeker"
                  id="jobseeker"
                  checked={input.role === "jobseeker"}
                  onChange={onChangeHandler}
                  className="w-4 h-4 accent-[#0066FF] cursor-pointer"
                />
                <Label htmlFor="jobseeker" className="text-sm text-gray-600 cursor-pointer">
                  Job Seeker
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  id="employer"
                  checked={input.role === "employer"}
                  onChange={onChangeHandler}
                  className="w-4 h-4 accent-[#0066FF] cursor-pointer"
                />
                <Label htmlFor="employer" className="text-sm text-gray-600 cursor-pointer">
                  Employer
                </Label>
              </div>
            </div>
          </div>
          {
            loading? <Button className="w-full bg-blue-500 hover:bg-[#0066FF] hover:text-black text-white font-medium py-2 cursor-pointer"><Loader2 className="mr-2 h-4 animate-spin" /> Loading...</Button> :  <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-[#0066FF] hover:text-black text-white font-medium py-2 cursor-pointer"
          >
            Login
          </Button>
          }

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#0066FF] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;