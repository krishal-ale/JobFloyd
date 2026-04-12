import React, { useState } from "react";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const NavBar = () => {
  const { user } = useSelector((store) => store.authSlice);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-14 sm:h-16 px-4 sm:px-6">
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight flex items-center">
          <img
            src={logo}
            alt="JobFloyd"
            className="h-12 sm:h-14 w-auto object-contain"
          />
          Job <span className="text-[#0066FF] font-bold">Floyd</span>
        </Link>

        <ul className="hidden md:flex font-medium items-center gap-10 text-gray-600 text-lg">
          {user && user.role === "employer" ? (
            <>
              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname === "/admin/company"
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/admin/company">Company</Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname === "/admin/company"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>

              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname === "/admin/jobs"
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/admin/jobs">Jobs</Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname === "/admin/jobs"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </>
          ) : user && user.role === "jobseeker" ? (
            <>
              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname === "/"
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/">Home</Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname === "/"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>

              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname === "/jobs"
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/jobs">Jobs</Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname === "/jobs"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>

              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname === "/browse"
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/browse">Browse</Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname === "/browse"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>

              <li className="relative cursor-pointer group">
                <span
                  className={`transition-colors duration-200 ${
                    location.pathname.startsWith("/resume-builder")
                      ? "text-[#0066FF]"
                      : "group-hover:text-[#0066FF]"
                  }`}
                >
                  <Link to="/resume-builder" className="flex items-center gap-2">
                    <FileText size={16} />
                    Resume Builder
                  </Link>
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                    location.pathname.startsWith("/resume-builder")
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            </>
          ) : (
            <li className="relative cursor-pointer group">
              <span
                className={`transition-colors duration-200 ${
                  location.pathname === "/"
                    ? "text-[#0066FF]"
                    : "group-hover:text-[#0066FF]"
                }`}
              >
                <Link to="/">Home</Link>
              </span>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${
                  location.pathname === "/"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white text-sm"
                >
                  Login
                </Button>
              </Link>

              <Link to="/signup" className="hidden sm:block">
                <Button className="bg-[#0066FF] hover:bg-blue-800 hover:text-white text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-blue-100 hover:ring-blue-400 transition-all duration-200 h-9 w-9">
                  <AvatarImage
                    src={
                      user?.profile?.profilePicture ||
                      "https://github.com/shadcn.png"
                    }
                    alt="user"
                  />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-56 p-4 shadow-md rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user?.profile?.profilePicture}
                      alt="user"
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {user?.fullName}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                {user && user.role === "jobseeker" && (
                  <div className="flex flex-col gap-2 mt-3">
                    <Button
                      variant="secondary"
                      className="w-full justify-center gap-2 text-sm hover:text-[#0066FF] hover:bg-blue-50"
                      asChild
                    >
                      <Link to="/profile">
                        <User2 className="h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>

                    <Button
                      variant="secondary"
                      className="w-full justify-center gap-2 text-sm hover:text-[#0066FF] hover:bg-blue-50"
                      asChild
                    >
                      <Link to="/resume-builder">
                        <FileText className="h-4 w-4" />
                        Resume Builder
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-3">
                  <Button
                    variant="destructive"
                    className="w-full justify-center gap-2 text-sm"
                    onClick={logoutHandler}
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-[#0066FF] hover:bg-slate-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          <ul className="flex flex-col font-medium text-gray-600 text-sm">
            {user && user.role === "employer" ? (
              <>
                <li
                  className={`py-2.5 border-b border-slate-100 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname === "/admin/company"
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/admin/company" onClick={() => setMenuOpen(false)}>
                    Company
                  </Link>
                </li>

                <li
                  className={`py-2.5 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname === "/admin/jobs"
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/admin/jobs" onClick={() => setMenuOpen(false)}>
                    Jobs
                  </Link>
                </li>
              </>
            ) : user && user.role === "jobseeker" ? (
              <>
                <li
                  className={`py-2.5 border-b border-slate-100 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname === "/"
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </Link>
                </li>

                <li
                  className={`py-2.5 border-b border-slate-100 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname === "/jobs"
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/jobs" onClick={() => setMenuOpen(false)}>
                    Jobs
                  </Link>
                </li>

                <li
                  className={`py-2.5 border-b border-slate-100 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname === "/browse"
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/browse" onClick={() => setMenuOpen(false)}>
                    Browse
                  </Link>
                </li>

                <li
                  className={`py-2.5 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                    location.pathname.startsWith("/resume-builder")
                      ? "text-[#0066FF] underline"
                      : "hover:text-[#0066FF] hover:underline"
                  }`}
                >
                  <Link to="/resume-builder" onClick={() => setMenuOpen(false)}>
                    Resume Builder
                  </Link>
                </li>
              </>
            ) : (
              <li
                className={`py-2.5 cursor-pointer transition-colors duration-200 underline-offset-4 ${
                  location.pathname === "/"
                    ? "text-[#0066FF] underline"
                    : "hover:text-[#0066FF] hover:underline"
                }`}
              >
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;