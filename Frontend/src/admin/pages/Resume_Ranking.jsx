import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Loader2, RefreshCw, Sparkles, AlertTriangle, FileText,
} from "lucide-react";

const getRankStyle = (rank) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700 border border-yellow-300";
  if (rank === 2) return "bg-gray-100 text-gray-600 border border-gray-300";
  if (rank === 3) return "bg-orange-100 text-orange-600 border border-orange-300";
  return "bg-gray-50 text-gray-500 border border-gray-200";
};

const Resume_Ranking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rankedApplicants, setRankedApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [error, setError] = useState("");

  const fetchRankedResumes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/rank-job-resumes/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setRankedApplicants(res.data.rankedApplicants || []);
        setJobTitle(res.data.jobTitle || "");
        setModelUsed(res.data.modelUsed || "");
      } else {
        setError(res.data.message || "Failed to rank resumes");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankedResumes();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066FF] shrink-0" />
              Resume AI Ranking
            </h1>
            {/* Action buttons — top right on all screens */}
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="h-9 px-3 text-sm">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Button
                size="sm"
                onClick={fetchRankedResumes}
                className="bg-[#0066FF] hover:bg-blue-700 text-white h-9 px-3 text-sm"
              >
                <RefreshCw className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Rank Again</span>
              </Button>
            </div>
          </div>

          {jobTitle && (
            <div className="mt-1">
              <p className="text-xs text-gray-400">Job Title</p>
              <h2 className="text-lg sm:text-2xl font-bold text-[#0066FF] leading-tight">{jobTitle}</h2>
            </div>
          )}
          {modelUsed && (
            <p className="text-xs text-gray-400 mt-1.5">Model: {modelUsed}</p>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin mb-4" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              AI is ranking the resumes…
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              This may take a moment depending on the number of resumes.
            </p>
          </div>

        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 flex flex-col items-center text-center gap-2">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <p className="text-red-500 font-medium text-sm">{error}</p>
          </div>

        ) : rankedApplicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 flex flex-col items-center text-center gap-2">
            <div className="text-4xl">📭</div>
            <p className="text-gray-500 text-sm font-medium">No resumes found for ranking.</p>
          </div>

        ) : (
          <>
            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {rankedApplicants.map((item) => (
                <div key={item.applicationId} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${getRankStyle(item.rank)}`}>
                        #{item.rank}
                      </span>
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    </div>
                    <span className="bg-blue-50 text-[#0066FF] text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                      {item.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {item.error ? (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Failed to read PDF
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">✓ Ranked Successfully</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-3"
                      onClick={() => window.open(item.resumeUrl, "_blank")}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3">Rank</th>
                      <th className="text-left px-4 py-3">Candidate Name</th>
                      <th className="text-left px-4 py-3">AI Score</th>
                      <th className="text-left px-4 py-3">Resume</th>
                      <th className="text-left px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedApplicants.map((item) => (
                      <tr key={item.applicationId} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRankStyle(item.rank)}`}>
                            #{item.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full font-medium">
                            {item.score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm" onClick={() => window.open(item.resumeUrl, "_blank")}>
                            <FileText className="w-3.5 h-3.5 mr-1.5" /> View Resume
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          {item.error ? (
                            <span className="text-red-500 text-xs flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Failed to read PDF
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs font-medium">✓ Ranked Successfully</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Important Notice</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Do not fully rely on AI ranking results. Manually review resumes before making final hiring decisions.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Resume_Ranking;