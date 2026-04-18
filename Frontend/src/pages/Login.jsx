import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/shared/NavBar";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setUser,
  setSessionExpiresAt,
  setSuperAdminOtpPending,
  setSuperAdminEmail,
} from "@/redux/authSlice";
import { Loader2, ShieldCheck } from "lucide-react";

const SUPER_ADMIN_EMAIL = "jobfloyd.app@gmail.com";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [otpInput, setOtpInput] = useState("");
  const [isSuperAdminEmail, setIsSuperAdminEmail] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const { loading, user } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const isAdmin = value.toLowerCase().trim() === SUPER_ADMIN_EMAIL;
      setIsSuperAdminEmail(isAdmin);
      if (isAdmin) {
        setInput((prev) => ({ ...prev, email: value, role: "" }));
      } else {
        setInput((prev) => ({ ...prev, email: value, role: "" }));
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isSuperAdminEmail && !input.role) {
      toast.error("Please select your role");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input);

      if (res.data.success && res.data.requiresOtp) {
        setOtpStep(true);
        dispatch(setSuperAdminOtpPending(true));
        dispatch(setSuperAdminEmail(input.email));
        toast.success("OTP sent to admin email");
        return;
      }

      if (res.data.success) {
        dispatch(setUser(res.data.responseUser));
        dispatch(setSessionExpiresAt(res.data.tokenExpiresAt || null));
        toast.success(res.data.message);

        if (res.data.responseUser.role === "employer") {
          navigate("/admin/company");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onOtpSubmitHandler = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/verify-superadmin-otp`, {
        email: input.email,
        otp: otpInput,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.responseUser));
        dispatch(setSessionExpiresAt(res.data.tokenExpiresAt || null));
        dispatch(setSuperAdminOtpPending(false));
        dispatch(setSuperAdminEmail(null));
        toast.success(res.data.message);
        navigate("/superadmin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (user.email === SUPER_ADMIN_EMAIL) {
        navigate("/superadmin/dashboard");
      } else if (user.role === "employer") {
        navigate("/admin/company");
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden">

        {/* OTP Step */}
        {otpStep ? (
          <form
            onSubmit={onOtpSubmitHandler}
            className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-xl p-5 sm:p-8 hover:border-[#0066FF] transition-colors focus-within:border-[#0066FF]"
          >
            <div className="mb-6 flex flex-col items-center">
              <div className="bg-blue-50 p-3 rounded-2xl mb-3">
                <ShieldCheck className="h-8 w-8 text-[#0066FF]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Admin Verification
              </h1>
              <p className="text-sm text-gray-400 mt-1 text-center">
                Enter the OTP sent to{" "}
                <span className="text-[#0066FF] font-medium">{input.email}</span>
              </p>
            </div>

            <div className="mb-5">
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                One-Time Password
              </Label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full text-center text-lg tracking-widest"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            {loading ? (
              <Button className="w-full bg-blue-500 hover:bg-[#0066FF] text-white font-medium py-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-[#0066FF] text-white font-medium py-2"
              >
                Verify & Login
              </Button>
            )}

            <p
              className="text-center text-sm text-[#0066FF] mt-4 cursor-pointer hover:underline"
              onClick={() => { setOtpStep(false); setOtpInput(""); }}
            >
              ← Back to Login
            </p>
          </form>

        ) : (
          
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-xl p-5 sm:p-8 hover:border-[#0066FF] transition-colors focus-within:border-[#0066FF]"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-400 mt-1 text-center">
                Login to Job<span className="text-[#0066FF] font-bold">Floyd</span>
              </p>
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </Label>
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
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="w-full"
                name="password"
                value={input.password}
                onChange={onChangeHandler}
              />
            </div>

            {/* ── Role Selection ── */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">I am a</p>
              {isSuperAdminEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    id="admin"
                    checked={input.role === "admin"}
                    onChange={onChangeHandler}
                    className="w-4 h-4 accent-[#0066FF] cursor-pointer"
                  />
                  <Label htmlFor="admin" className="text-sm text-gray-600 cursor-pointer flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#0066FF]" />
                    Admin
                  </Label>
                </div>
              ) : (
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
              )}
            </div>

            {loading ? (
              <Button className="w-full bg-blue-500 hover:bg-[#0066FF] text-white font-medium py-2 cursor-pointer">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-[#0066FF] text-white font-medium py-2 cursor-pointer"
              >
                Login
              </Button>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#0066FF] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;