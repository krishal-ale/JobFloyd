import Resume from "../models/resume.model.js";

const defaultResumeData = {
  title: "Professional Resume",
  thumbnailLink: "",
  template: {
    theme: "03",
    colorPalette: [],
  },
  profileInfo: {
    fullName: "",
    designation: "",
    summary: "",
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
  completion: 0,
};

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.id,
      ...defaultResumeData,
    });

    return res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.id }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    Object.assign(resume, req.body);
    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};