import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let resumeUrl = "";
    let resumeName = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
        format: "pdf",
        access_mode: "public",
      });

      resumeUrl = cloudResponse.secure_url;
      resumeName = req.file.originalname;
    } else if (user?.profile?.resume) {
      resumeUrl = user.profile.resume;
      resumeName = user.profile.resumeName || "Resume.pdf";
    }

    if (!resumeUrl) {
      return res.status(400).json({
        message: "Please choose a resume before applying",
        success: false,
      });
    }

    const newApplication = await Application.create({
      applicant: userId,
      job: jobId,
      resume: {
        url: resumeUrl,
        name: resumeName,
      },
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
      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/admin/jobs/${job._id}/applicants">
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
      application: newApplication,
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
    const { status, acceptedDetails } = req.body;
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

    if (normalizedStatus === "accepted") {
      if (
        !acceptedDetails ||
        !acceptedDetails.interviewDate ||
        !acceptedDetails.interviewTime ||
        !acceptedDetails.interviewLocation ||
        !acceptedDetails.jobTime ||
        !acceptedDetails.startingFrom ||
        !acceptedDetails.contactEmail ||
        !acceptedDetails.contactNumber
      ) {
        return res.status(400).json({
          message:
            "Please fill interview date, time, location, job time, starting from, contact email, and contact number",
          success: false,
        });
      }

      application.acceptedDetails = {
        interviewDate: acceptedDetails.interviewDate || "",
        interviewTime: acceptedDetails.interviewTime || "",
        interviewLocation: acceptedDetails.interviewLocation || "",
        jobTime: acceptedDetails.jobTime || "",
        startingFrom: acceptedDetails.startingFrom || "",
        contactEmail: acceptedDetails.contactEmail || "",
        contactNumber: acceptedDetails.contactNumber || "",
        moreMessage: acceptedDetails.moreMessage || "",
      };
    }

    application.status = normalizedStatus;
    await application.save();

    const applicant = application.applicant;
    const job = application.job;
    const companyName = job?.company?.name || "the company";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (applicant?.email) {
      if (normalizedStatus === "accepted") {
        const details = application.acceptedDetails || {};

        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
            <div style="max-width: 620px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background: #0066FF; color: white; padding: 20px 24px;">
                <h2 style="margin: 0;">Congratulations! Your application has been accepted</h2>
              </div>

              <div style="padding: 24px;">
                <p>Hello ${applicant.fullName || "Candidate"},</p>

                <p>
                  We are pleased to inform you that your application for
                  <strong>${job?.title || "this job"}</strong> at
                  <strong>${companyName}</strong> has been <strong>accepted</strong>.
                </p>

                <p>Please find the next-step details below:</p>

                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tbody>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Interview Date</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.interviewDate || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Interview Time</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.interviewTime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Location</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.interviewLocation || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Job Time</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.jobTime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Starting From</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.startingFrom || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Contact Email</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.contactEmail || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Contact Number</td>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;">${details.contactNumber || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>

                ${
                  details.moreMessage
                    ? `<div style="margin-top: 16px; padding: 14px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <p style="margin: 0 0 8px 0; font-weight: bold;">Additional Message</p>
                        <p style="margin: 0;">${details.moreMessage}</p>
                      </div>`
                    : ""
                }

                <div style="margin-top: 24px;">
                  <a
                    href="${frontendUrl}/jobs/description/${job._id}"
                    style="display: inline-block; background: #0066FF; color: white; text-decoration: none; padding: 12px 18px; border-radius: 999px;"
                  >
                    View Job Details
                  </a>
                </div>

                <p style="margin-top: 24px;">We look forward to meeting you.</p>
                <p>Regards,<br />${companyName}</p>
              </div>
            </div>
          </div>
        `;

        await sendEmail({
          to: applicant.email,
          subject: `Congratulations! You have been accepted for ${job?.title || "the job"}`,
          html,
        });
      }

      if (normalizedStatus === "rejected") {
        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Application Status Update</h2>
            <p>Hello ${applicant.fullName || "Applicant"},</p>
            <p>Your application for <strong>${job?.title || "this job"}</strong> at <strong>${companyName}</strong> has been <strong>rejected</strong>.</p>
            <p>
              Open JobFloyd:
              <a href="${frontendUrl}/jobs/description/${job._id}">
                JobFloyd
              </a>
            </p>
          </div>
        `;

        await sendEmail({
          to: applicant.email,
          subject: `Your application was rejected`,
          html,
        });
      }
    }

    return res.status(200).json({
      message:
        normalizedStatus === "accepted"
          ? "Candidate accepted and details sent successfully"
          : normalizedStatus === "rejected"
          ? "Candidate rejected successfully"
          : "Application status updated successfully",
      success: true,
      application,
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
      application?.resume?.url &&
      application?.applicant?.fullName
  )
  .map((application) => ({
    applicationId: application._id,
    applicantId: application.applicant._id,
    name: application.applicant.fullName,
    email: application.applicant.email,
    phoneNumber: application.applicant.phoneNumber,
    resumeUrl: application.resume.url,
    resumeName: application.resume.name || "Resume.pdf",
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