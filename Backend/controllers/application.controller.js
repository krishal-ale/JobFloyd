import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      applicant: userId,
      job: jobId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    const applicant = await User.findById(userId).select("fullName email");
    const employer = await User.findById(job.created_by).select("fullName email");

    if (employer?.email && applicant) {
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Job Application</h2>
          <p>Hello ${employer.fullName || "Employer"},</p>
          <p><strong>${applicant.fullName}</strong> has applied for your job <strong>${job.title}</strong>.</p>
          <p>Applicant Email: ${applicant.email}</p>
          <p>Company: ${job.company?.name || "Your Company"}</p>
          <p>
            Open JobFloyd:
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login">
              JobFloyd
            </a>
          </p>
        </div>
      `;

      await sendEmail({
        to: employer.email,
        subject: `New application for ${job.title}`,
        html,
      });
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      message: "Applications found",
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Applications found",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const normalizedStatus = status.toLowerCase();

    if (!["pending", "accepted", "rejected"].includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status",
        success: false,
      });
    }

    const application = await Application.findById(applicationId)
      .populate("applicant")
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = normalizedStatus;
    await application.save();

    const applicant = application.applicant;
    const job = application.job;
    const companyName = job?.company?.name || "the company";

    if (applicant?.email) {
      const statusText =
        normalizedStatus === "accepted" ? "accepted" : normalizedStatus === "rejected" ? "rejected" : "updated";

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Application Status Update</h2>
          <p>Hello ${applicant.fullName || "Applicant"},</p>
          <p>Your application for <strong>${job?.title || "this job"}</strong> at <strong>${companyName}</strong> has been <strong>${statusText}</strong>.</p>
          <p>
            Open JobFloyd:
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login">
              JobFloyd
            </a>
          </p>
        </div>
      `;

      await sendEmail({
        to: applicant.email,
        subject: `Your application was ${statusText}`,
        html,
      });
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

export const rankJobResumesWithAI = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "fullName email phoneNumber profile",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const applicantsWithResume = job.applications
      .filter(
        (application) =>
          application?.applicant?.profile?.resume &&
          application?.applicant?.fullName
      )
      .map((application) => ({
        applicationId: application._id,
        applicantId: application.applicant._id,
        name: application.applicant.fullName,
        email: application.applicant.email,
        phoneNumber: application.applicant.phoneNumber,
        resumeUrl: application.applicant.profile.resume,
        resumeName: application.applicant.profile.resumeName || "Resume.pdf",
      }));

    if (applicantsWithResume.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No resumes found for ranking",
        jobTitle: job.title,
        rankedApplicants: [],
      });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:5001";

    const aiResponse = await fetch(`${aiServiceUrl}/rank-resumes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumes: applicantsWithResume,
      }),
    });

    const aiData = await aiResponse.json();

    if (!aiResponse.ok || !aiData.success) {
      return res.status(500).json({
        success: false,
        message: aiData.message || "AI ranking failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "AI ranking completed successfully",
      jobTitle: job.title,
      totalApplicants: job.applications.length,
      rankedApplicants: aiData.results || [],
      modelUsed: aiData.modelUsed || "",
    });
  } catch (error) {
    console.log("AI ranking error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while ranking resumes",
      error: error.message,
    });
  }
};