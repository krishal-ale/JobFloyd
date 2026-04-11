import React, { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
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
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="font-bold text-xl">
            Applicants ({applicants?.length || 0})
          </h1>

          <Button
            onClick={() => navigate(`/admin/jobs/${params.id}/resume-ranking`)}
            className="bg-[#0066FF] hover:bg-blue-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Rank Resumes with AI
          </Button>
        </div>

        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;