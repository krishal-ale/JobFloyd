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
    dispatch(setSearchQuery(query));
    navigate("/browse");
  };

  return (
    <div className="bg-[#0066FF] text-white px-4 py-14 sm:py-20">
      <div className="flex justify-center mb-6">
        <span className="flex items-center gap-2 bg-white text-[#0066FF] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full">
          <TrendingUp className="h-4 w-4" />
          10,000+ Jobs Available Right Now
        </span>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Your Career Journey <br />
          <span className="text-yellow-300">Starts Here.</span>
        </h1>

        <p className="text-blue-100 text-sm sm:text-lg max-w-xl mx-auto mb-10">
          Welcome to JobFloyd: Thousands of jobs. Top companies. One platform —
          built to get you hired faster.
        </p>

        {/* search bar */}
        <div className="flex w-[95%] sm:w-[70%] lg:w-[55%] mx-auto bg-white rounded-full items-center gap-2 px-3 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <Input
            type="text"
            placeholder={
              user
                ? "Search for jobs, companies, or keywords"
                : "Login to search for jobs"
            }
            className="w-full border-none shadow-none focus-visible:ring-0 text-gray-700 text-sm sm:text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={searchJobHandler}
            className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-full px-5 sm:px-7 py-5 text-xs sm:text-sm shrink-0"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;