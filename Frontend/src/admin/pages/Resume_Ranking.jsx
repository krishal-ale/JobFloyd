import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

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

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#0066FF]" />
              Resume AI Ranking
            </h1>

            {jobTitle ? (
              <div className="mt-2">
                <p className="text-xs text-gray-400">Job Title</p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0066FF]">
                  {jobTitle}
                </h2>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Ranking resumes for this job
              </p>
            )}

            {modelUsed && (
              <p className="text-xs text-gray-400 mt-2">
                Model used: {modelUsed}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={fetchRankedResumes}
              className="bg-[#0066FF] hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Rank Again
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin mb-4" />
            <h2 className="text-lg font-semibold text-gray-800">
              Please wait AI is ranking the resumes...
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              This may take a little time depending on the number of resumes.
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : rankedApplicants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <p className="text-gray-500">No resumes found for ranking.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
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
                      <tr key={item.applicationId} className="border-t">
                        <td className="px-4 py-3 font-semibold">{item.rank}</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full font-medium">
                            {item.score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(item.resumeUrl, "_blank")}
                          >
                            View Resume
                          </Button>
                        </td>
                        <td className="px-4 py-3">
                          {item.error ? (
                            <span className="text-red-500 text-xs">
                              Failed to read PDF
                            </span>
                          ) : (
                            <span className="text-green-600 text-xs">
                              Ranked Successfully
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 w-5 h-5 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Important Notice
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Do not fully rely on AI ranking results. It is recommended to
                  manually review resumes before making final hiring decisions.
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