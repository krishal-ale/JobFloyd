import React, { useEffect, useState } from "react";
import NavBar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { FilePlus2, Pencil, Trash2 } from "lucide-react";

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await axios.get(RESUME_API_END_POINT, {
        withCredentials: true,
      });

      if (res.data.success) {
        setResumes(res.data.resumes || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch resumes");
    }
  };

  const createResume = async () => {
    try {
      setCreating(true);

      const res = await axios.post(
        RESUME_API_END_POINT,
        {},
        { withCredentials: true }
      );

      if (res.data.success && res.data.resume?._id) {
        navigate(`/resume-builder/${res.data.resume._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create resume");
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id) => {
    try {
      const res = await axios.delete(`${RESUME_API_END_POINT}/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchResumes();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete resume");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My <span className="text-[#0066FF]">Resumes</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Create, edit, and download your professional resumes
            </p>
          </div>

          <Button
            onClick={createResume}
            disabled={creating}
            className="bg-[#0066FF] hover:bg-blue-700 text-white"
          >
            <FilePlus2 className="w-4 h-4 mr-2" />
            {creating ? "Opening..." : "Create New Resume"}
          </Button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">
              No resumes found. Create your first resume.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
              >
                <h2 className="font-bold text-lg text-gray-900 mb-2">
                  {resume.title || "Untitled Resume"}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Updated: {resume.updatedAt?.split("T")[0]}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/resume-builder/${resume._id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteResume(resume._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;