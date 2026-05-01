import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "@/components/shared/NavBar";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [otp, setOtp] = useState("");

  const { loading, user } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onFileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const passwordChecks = {
    length: input.password.length >= 8,
    uppercase: /[A-Z]/.test(input.password),
    number: /\d/.test(input.password),
    special: /[@$!%*?&^#()[\]{}\-_=+~`|;:'",.<>/\\]/.test(input.password),
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/send-register-otp`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-register-otp`,
        {
          email: input.email,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const renderRule = (isValid, text) => (
    <div className="flex items-center gap-1.5 min-w-0">
      {isValid ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
      )}
      <span
        className={`text-xs leading-5 ${
          isValid ? "text-green-600" : "text-red-500"
        }`}
      >
        {text}
      </span>
    </div>
  );

  return (
  <div className="h-screen flex flex-col overflow-hidden">
    <NavBar />

    <div className="flex-1 bg-slate-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <form
        className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-xl p-5 sm:p-8 hover:border-[#0066FF] transition-colors focus-within:border-[#0066FF]"
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
      >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-sm text-gray-400 mt-1 text-center">
              {step === 1
                ? "Join JobFloyd today"
                : `Enter the code sent to ${input.email}`}
            </p>
          </div>

          {step === 1 ? (
            <>
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Full Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full"
                  name="fullName"
                  value={input.fullName}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  name="email"
                  value={input.email}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="mb-2">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full"
                  name="password"
                  value={input.password}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {renderRule(passwordChecks.length, "8+ characters")}
                {renderRule(passwordChecks.uppercase, "1 uppercase")}
                {renderRule(passwordChecks.number, "1 number")}
                {renderRule(passwordChecks.special, "1 special character")}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
                <div>
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
                      <Label
                        htmlFor="jobseeker"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
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
                      <Label
                        htmlFor="employer"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Employer
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={onFileChangeHandler}
                    className="cursor-pointer text-sm text-gray-500 w-36"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-medium py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="mb-5">
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Verification Code
                </Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-medium py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-3 text-sm text-[#0066FF] hover:underline"
              >
                Go Back
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0066FF] font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;