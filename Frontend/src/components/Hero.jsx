import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Search, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Hero = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const searchJobHandler = () => {
    if (!user) {
      toast.error("Please login to search for jobs.");
      return;
    }
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      toast.error("Please enter something to search.");
      return;
    }
    dispatch(setSearchQuery(trimmedQuery));
    navigate("/browse");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchJobHandler();
  };

  return (
    <div className="bg-[#0066FF] text-white px-4 pt-12 pb-16 sm:py-20">
      <div className="flex justify-center mb-5">
        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
          <TrendingUp className="h-3.5 w-3.5" />
          10,000+ Jobs Available Right Now
        </span>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-[2rem] leading-[1.2] sm:text-5xl lg:text-6xl font-extrabold mb-3">
          Your Career Journey
          <br />
          <span className="text-yellow-300">Starts Here.</span>
        </h1>

        <p className="text-blue-100 text-sm sm:text-lg max-w-md mx-auto mb-8 px-2 leading-relaxed">
          Thousands of jobs. Top companies. One platform — built to get you hired faster.
        </p>

        <div className="w-full max-w-[95%] sm:max-w-[70%] lg:max-w-[55%] mx-auto flex flex-col sm:flex-row gap-2.5 sm:gap-0 sm:bg-white sm:rounded-full sm:items-center sm:px-3 sm:py-2 sm:shadow-lg">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 sm:py-0 sm:px-0 sm:bg-transparent sm:flex-1 shadow-lg sm:shadow-none">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <Input
              type="text"
              placeholder={user ? "Job title, company, or keyword…" : "Login to search for jobs"}
              className="border-none shadow-none focus-visible:ring-0 text-gray-700 text-sm placeholder:text-gray-400 p-0 h-auto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button
            onClick={searchJobHandler}
            className="w-full sm:w-auto bg-[#0066FF] hover:bg-blue-700 text-white rounded-full px-7 py-5 text-sm font-semibold shrink-0 shadow-lg sm:shadow-none"
          >
            <Search className="h-4 w-4 sm:hidden" />
            <span className="sm:inline">Search Jobs</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;