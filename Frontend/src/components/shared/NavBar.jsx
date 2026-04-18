import React, { useState } from "react";
import { PopoverContent, PopoverTrigger, Popover } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X, FileText, Bookmark, LayoutDashboard, Building2, Users, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import axios from "@/utils/axiosInstance";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const SUPER_ADMIN_EMAIL = "jobfloyd.app@gmail.com";

const NavLink = ({ to, label, icon: Icon, location }) => (
  <li className="relative cursor-pointer group">
    <span className={`transition-colors duration-200 flex items-center gap-1.5 ${location.pathname === to || location.pathname.startsWith(to + "/") ? "text-[#0066FF]" : "group-hover:text-[#0066FF]"}`}>
      {Icon && <Icon size={15} />}
      <Link to={to}>{label}</Link>
    </span>
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0066FF] transition-all duration-300 ${location.pathname === to || location.pathname.startsWith(to + "/") ? "w-full" : "w-0 group-hover:w-full"}`} />
  </li>
);

const NavBar = () => {
  const { user } = useSelector((store) => store.authSlice);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
        setMenuOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const mobileLinks = isSuperAdmin
    ? [
        { to: "/superadmin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/superadmin/employers", label: "Employers", icon: Building2 },
        { to: "/superadmin/jobseekers", label: "Job Seekers", icon: Users },
      ]
    : user?.role === "employer"
    ? [
        { to: "/admin/company", label: "Company", icon: Building2 },
        { to: "/admin/jobs", label: "Jobs", icon: FileText },
      ]
    : user?.role === "jobseeker"
    ? [
        { to: "/", label: "Home", icon: LayoutDashboard },
        { to: "/jobs", label: "Jobs", icon: FileText },
        { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
        { to: "/resume-builder", label: "Resume Builder", icon: FileText },
      ]
    : [{ to: "/", label: "Home", icon: LayoutDashboard }];

  return (
    <>
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-14 sm:h-16 px-4 sm:px-6">
          <Link
            to={isSuperAdmin ? "/superadmin/dashboard" : "/"}
            className="text-xl sm:text-2xl font-bold tracking-tight flex items-center"
          >
            <img src={logo} alt="JobFloyd" className="h-10 sm:h-14 w-auto object-contain" />
            Job<span className="text-[#0066FF] font-bold">Floyd</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex font-medium items-center gap-10 text-gray-600 text-lg">
            {isSuperAdmin ? (
              <>
                <NavLink to="/superadmin/dashboard" label="Dashboard" icon={LayoutDashboard} location={location} />
                <NavLink to="/superadmin/employers" label="Employers" icon={Building2} location={location} />
                <NavLink to="/superadmin/jobseekers" label="Job Seekers" icon={Users} location={location} />
              </>
            ) : user?.role === "employer" ? (
              <>
                <NavLink to="/admin/company" label="Company" location={location} />
                <NavLink to="/admin/jobs" label="Jobs" location={location} />
              </>
            ) : user?.role === "jobseeker" ? (
              <>
                <NavLink to="/" label="Home" location={location} />
                <NavLink to="/jobs" label="Jobs" location={location} />
                <NavLink to="/saved-jobs" label="Saved Jobs" icon={Bookmark} location={location} />
                <NavLink to="/resume-builder" label="Resume Builder" icon={FileText} location={location} />
              </>
            ) : (
              <NavLink to="/" label="Home" location={location} />
            )}
          </ul>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white text-sm h-9 px-4">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button className="bg-[#0066FF] hover:bg-blue-800 text-white text-sm h-9 px-4">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer ring-2 ring-blue-100 hover:ring-blue-400 transition-all duration-200 h-9 w-9">
                    <AvatarImage
                      src={user?.profile?.profilePicture || "https://github.com/shadcn.png"}
                      alt="user"
                    />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 shadow-md rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profile?.profilePicture} alt="user" />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{user?.fullName}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-snug">
                        {isSuperAdmin ? "Super Admin" : user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  {user?.role === "jobseeker" && (
                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="secondary" className="w-full justify-center gap-2 text-sm hover:text-[#0066FF] hover:bg-blue-50" asChild>
                        <Link to="/profile">
                          <User2 className="h-4 w-4" /> View Profile
                        </Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="destructive" className="w-full justify-center gap-2 text-sm" onClick={logoutHandler}>
                      <LogOut className="h-4 w-4" /> Log Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-[#0066FF] hover:bg-slate-50 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src={logo} alt="JobFloyd" className="h-8 w-auto object-contain" />
            <span className="font-bold text-base">Job<span className="text-[#0066FF]">Floyd</span></span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section in Drawer */}
        {user && (
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-blue-100">
                <AvatarImage
                  src={user?.profile?.profilePicture || "https://github.com/shadcn.png"}
                  alt="user"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate">
                  {isSuperAdmin ? "Super Admin" : user?.email}
                </p>
              </div>
            </div>
            {user?.role === "jobseeker" && (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-slate-200 bg-white text-sm text-gray-600 font-medium hover:text-[#0066FF] hover:border-blue-200 transition-colors"
              >
                <User2 className="h-4 w-4" /> View Profile
              </Link>
            )}
          </div>
        )}

        {/* Nav Links */}
        <div className="px-3 py-3 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {mobileLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(to)
                      ? "bg-blue-50 text-[#0066FF]"
                      : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {Icon && (
                      <span className={`p-1.5 rounded-lg ${isActive(to) ? "bg-blue-100" : "bg-slate-100"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    {label}
                  </span>
                  {isActive(to) && <ChevronRight className="h-4 w-4 text-[#0066FF]" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-slate-100">
          {!user ? (
            <div className="flex flex-col gap-2.5">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white h-11 text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-[#0066FF] hover:bg-blue-800 text-white h-11 text-sm font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              variant="destructive"
              className="w-full justify-center gap-2 text-sm h-11 font-medium"
              onClick={logoutHandler}
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;