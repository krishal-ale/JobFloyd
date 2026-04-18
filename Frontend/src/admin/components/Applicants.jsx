import React, { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "@/utils/axiosInstance";
import NavBar from "@/components/shared/NavBar";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setApplications } from "@/redux/applicationSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Applicants = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.applicationSlice);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/get-job-applications/${params.id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setApplications(res.data.job?.applications || []));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplicants();
  }, [params.id, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-bold text-xl sm:text-2xl text-gray-900">
              Applicants ({applicants?.length || 0})
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage applicant status and review resumes.
            </p>
          </div>

          <Button
            onClick={() => navigate(`/admin/jobs/${params.id}/resume-ranking`)}
            className="bg-[#0066FF] hover:bg-blue-700 text-white shrink-0 h-10 text-sm px-4"
          >
            <Sparkles className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Rank Resumes with AI</span>
          </Button>
        </div>

        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;