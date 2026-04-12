import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Download,
  Palette,
  Save,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "@/components/shared/NavBar";
import { RESUME_API_END_POINT } from "@/utils/constant";
import html2pdf from "html2pdf.js";
import "@/resumeBuilder/styles/A4.css";

import { TitleInput } from "@/resumeBuilder/components/Inputs";
import StepProgress from "@/resumeBuilder/components/StepProgress";
import RenderResume from "@/resumeBuilder/components/RenderResume";
import ThemeSelector from "@/resumeBuilder/components/ThemeSelector";
import ResumeBuilderModal from "@/resumeBuilder/components/ResumeBuilderModal";

import { ProfileInfoForm } from "@/resumeBuilder/forms/ProfileInfoForm";
import { ContactInfoForm } from "@/resumeBuilder/forms/ContactInfoForm";
import { WorkExperienceForm } from "@/resumeBuilder/forms/WorkExperienceForm";
import { EducationDetailsForm } from "@/resumeBuilder/forms/EducationDetailsForm";
import { SkillsInfoForm } from "@/resumeBuilder/forms/SkillsInfoForm";
import { ProjectDetailForm } from "@/resumeBuilder/forms/ProjectDetailForm";
import { CertificationInfoForm } from "@/resumeBuilder/forms/CertificationInfoForm";
import { AdditionalInfoForm } from "@/resumeBuilder/forms/AdditionalInfoForm";

const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });

      resizeObserver.observe(node);
    }
  }, []);

  return { ...size, ref };
};

const pages = [
  "profile-info",
  "contact-info",
  "work-experience",
  "education-info",
  "skills",
  "projects",
  "certifications",
  "additionalInfo",
];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const resumeDownloadRef = useRef(null);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "03",
      colorPalette: [],
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  const currentStepProgress = Math.round(
    (pages.indexOf(currentPage) / (pages.length - 1)) * 100
  );

  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    totalFields += 3;
    if (resumeData.profileInfo.fullName?.trim()) completedFields++;
    if (resumeData.profileInfo.designation?.trim()) completedFields++;
    if (resumeData.profileInfo.summary?.trim()) completedFields++;

    totalFields += 2;
    if (resumeData.contactInfo.email?.trim()) completedFields++;
    if (resumeData.contactInfo.phone?.trim()) completedFields++;

    resumeData.workExperience.forEach((exp) => {
      totalFields += 5;
      if (exp.company?.trim()) completedFields++;
      if (exp.role?.trim()) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description?.trim()) completedFields++;
    });

    resumeData.education.forEach((edu) => {
      totalFields += 4;
      if (edu.degree?.trim()) completedFields++;
      if (edu.institution?.trim()) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    resumeData.skills.forEach((skill) => {
      totalFields += 1;
      if (skill.name?.trim()) completedFields++;
    });

    resumeData.projects.forEach((project) => {
  totalFields += 4;
  if (project.title?.trim()) completedFields++;
  if (project.description?.trim()) completedFields++;
  if (project.github?.trim()) completedFields++;
  if (project.liveDemo?.trim()) completedFields++;
});

    resumeData.certifications.forEach((cert) => {
      totalFields += 3;
      if (cert.title?.trim()) completedFields++;
      if (cert.issuer?.trim()) completedFields++;
      if (cert.year?.trim()) completedFields++;
    });

    resumeData.languages.forEach((lang) => {
      totalFields += 1;
      if (lang.name?.trim()) completedFields++;
    });

    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter((i) => i.trim() !== "").length;

    const percentage =
      totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);

    setCompletionPercentage(percentage);
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

  const validateAndNext = () => {
    const errors = [];

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;
      }

      case "contact-info": {
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
          errors.push("Valid email is required");
        }
        if (!phone.trim() || !/^\d{10}$/.test(phone)) {
          errors.push("Valid 10-digit phone number is required");
        }
        break;
      }

      case "skills":
        resumeData.skills.forEach(({ name }, index) => {
          if (!name?.trim()) {
            errors.push(`Skill name is required in skill ${index + 1}`);
          }
        });
        break;

        case "projects":
  resumeData.projects.forEach(({ title, description }, index) => {
    if (!title?.trim()) {
      errors.push(`Project title is required in project ${index + 1}`);
    }
    if (!description?.trim()) {
      errors.push(`Project description is required in project ${index + 1}`);
    }
  });
  break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    setErrorMsg("");

    if (currentPage === "additionalInfo") {
      setOpenPreviewModal(true);
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentPage === "profile-info") {
      navigate("/resume-builder");
      return;
    }

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1]);
    }
  };

  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  const fetchResumeDetailsById = async () => {
    try {
      const response = await axios.get(`${RESUME_API_END_POINT}/${resumeId}`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.resume) {
        const resumeInfo = response.data.resume;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Professional Resume",
          template: resumeInfo?.template || prevState.template,
          profileInfo: resumeInfo?.profileInfo || prevState.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState.workExperience,
          education: resumeInfo?.education || prevState.education,
          skills: resumeInfo?.skills || prevState.skills,
          projects: resumeInfo?.projects || prevState.projects,
          certifications: resumeInfo?.certifications || prevState.certifications,
          languages: resumeInfo?.languages || prevState.languages,
          interests: resumeInfo?.interests || prevState.interests,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load resume data");
    }
  };

  const saveResumeDetails = async () => {
    try {
      setIsLoading(true);

      const payload = {
        ...resumeData,
        completion: completionPercentage,
        title:
          resumeData.title ||
          resumeData.profileInfo?.fullName ||
          "Professional Resume",
      };

      const res = await axios.put(
        `${RESUME_API_END_POINT}/${resumeId}`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);

      const res = await axios.delete(`${RESUME_API_END_POINT}/${resumeId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/resume-builder");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      await html2pdf()
        .set({
          margin: 0,
          filename: `${(resumeData.title || "resume").replace(
            /[^a-z0-9]/gi,
            "_"
          )}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
            logging: false,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
          },
        })
        .from(element)
        .save();

      toast.success("PDF downloaded successfully");
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateTheme = (theme) => {
    setResumeData((prev) => ({
      ...prev,
      template: {
        theme,
        colorPalette: [],
      },
    }));
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData.contactInfo}
            updateSection={(key, value) => updateSection("contactInfo", key, value)}
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("workExperience", index, key, value)
            }
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData.education}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("education", index, key, value)
            }
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData.skills}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("skills", index, key, value)
            }
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData.projects}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("projects", index, key, value)
            }
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData.certifications}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("certifications", index, key, value)
            }
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById();
    }
  }, [resumeId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TitleInput
              title={resumeData.title}
              setTitle={(value) =>
                setResumeData((prev) => ({
                  ...prev,
                  title: value,
                }))
              }
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-4 py-2 rounded-xl border border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] transition flex items-center gap-2"
                onClick={() => setOpenThemeSelector(true)}
              >
                <Palette size={16} />
                <span className="text-sm">Theme</span>
              </button>

              <button
                className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                onClick={handleDeleteResume}
                disabled={isLoading}
              >
                <Trash2 size={16} />
                <span className="text-sm">Delete</span>
              </button>

              <button
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white transition flex items-center gap-2"
                onClick={() => setOpenPreviewModal(true)}
              >
                <Download size={16} />
                <span className="text-sm">Preview</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <StepProgress progress={completionPercentage} />
            </div>

            <div className="p-4 sm:p-6">
              {renderForm()}

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] transition flex items-center gap-2"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-2"
                  onClick={saveResumeDetails}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isLoading ? "Saving..." : "Save"}
                </button>

                <button
                  className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white transition flex items-center gap-2"
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && <Download size={16} />}
                  {currentPage === "additionalInfo"
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage !== "additionalInfo" && (
                    <ArrowLeft size={16} className="rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#0066FF] text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse"></span>
                  Completion - {completionPercentage}%
                </div>
              </div>

              <div className="preview-container relative" ref={previewContainerRef}>
                <RenderResume
                  key={`preview-${resumeData?.template?.theme}`}
                  templateId={resumeData?.template?.theme || "03"}
                  resumeData={resumeData}
                  containerWidth={previewWidth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResumeBuilderModal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Change Theme"
      >
        <ThemeSelector
          selectedTheme={resumeData?.template?.theme}
          setSelectedTheme={updateTheme}
          resumeData={resumeData}
          onClose={() => setOpenThemeSelector(false)}
        />
      </ResumeBuilderModal>

      <ResumeBuilderModal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData.title}
        showActionBtn
        actionBtnText={
          isDownloading
            ? "Generating..."
            : downloadSuccess
            ? "Downloaded!"
            : "Download PDF"
        }
        actionBtnIcon={
          isDownloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : downloadSuccess ? (
            <Check size={16} />
          ) : (
            <Download size={16} />
          )
        }
        onActionClick={downloadPDF}
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#0066FF] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse"></span>
            Completion: {completionPercentage}%
          </div>
        </div>

        <div className="overflow-auto bg-gray-100 p-4 rounded-xl">
          <div
            ref={resumeDownloadRef}
            className="a4-wrapper mx-auto bg-white shadow-sm"
          >
            <RenderResume
              key={`pdf-${resumeData?.template?.theme}`}
              templateId={resumeData?.template?.theme || "03"}
              resumeData={resumeData}
              containerWidth={0}
            />
          </div>
        </div>
      </ResumeBuilderModal>
    </div>
  );
};

export default ResumeBuilder;