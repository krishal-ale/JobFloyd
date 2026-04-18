import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import axios from "@/utils/axiosInstance";
import { SUPER_ADMIN_API_END_POINT } from "@/utils/constant";
import {
  Users, Briefcase, Building2, FileText,
  CheckCircle, XCircle, Clock, LayoutDashboard,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
    <div className={`${bg} p-3 rounded-xl shrink-0`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">
        {value ?? <span className="text-gray-300">—</span>}
      </p>
    </div>
  </div>
);

const SADashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${SUPER_ADMIN_API_END_POINT}/dashboard-stats`);
        if (res.data.success) setStats(res.data.stats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Users, label: "Total Employers", value: stats?.totalEmployers, color: "text-[#0066FF]", bg: "bg-blue-50" },
    { icon: Users, label: "Total Job Seekers", value: stats?.totalJobSeekers, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Building2, label: "Total Companies", value: stats?.totalCompanies, color: "text-teal-600", bg: "bg-teal-50" },
    { icon: Briefcase, label: "Total Jobs", value: stats?.totalJobs, color: "text-orange-500", bg: "bg-orange-50" },
    { icon: FileText, label: "Total Applications", value: stats?.totalApplications, color: "text-gray-600", bg: "bg-gray-100" },
    { icon: CheckCircle, label: "Accepted", value: stats?.acceptedApplications, color: "text-green-600", bg: "bg-green-50" },
    { icon: XCircle, label: "Rejected", value: stats?.rejectedApplications, color: "text-red-500", bg: "bg-red-50" },
    { icon: Clock, label: "Pending", value: stats?.pendingApplications, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-[#0066FF]" />
            <h1 className="text-2xl font-bold text-gray-900">
              Super Admin <span className="text-[#0066FF]">Dashboard</span>
            </h1>
          </div>
          <p className="text-sm text-gray-400">Overview of all JobFloyd platform activity</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SADashboard;