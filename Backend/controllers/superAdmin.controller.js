import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployers = await User.countDocuments({ role: "employer", email: { $ne: "jobfloyd.app@gmail.com" } });
    const totalJobSeekers = await User.countDocuments({ role: "jobseeker" });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });
    const pendingApplications = await Application.countDocuments({ status: "pending" });

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployers,
        totalJobSeekers,
        totalCompanies,
        totalJobs,
        totalApplications,
        acceptedApplications,
        rejectedApplications,
        pendingApplications,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({
      role: "employer",
      email: { $ne: "jobfloyd.app@gmail.com" },
    }).select("-password").lean();

    const employersWithDetails = await Promise.all(
      employers.map(async (employer) => {
        const company = await Company.findOne({ userId: employer._id }).lean();
        const jobs = await Job.find({ created_by: employer._id }).lean();
        const jobIds = jobs.map((j) => j._id);
        const applicantsCount = await Application.countDocuments({ job: { $in: jobIds } });

        return {
          ...employer,
          company: company || null,
          jobsCount: jobs.length,
          jobs,
          applicantsCount,
        };
      })
    );

    return res.status(200).json({ success: true, employers: employersWithDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await User.find({ role: "jobseeker" }).select("-password").lean();

    const jobSeekersWithDetails = await Promise.all(
      jobSeekers.map(async (seeker) => {
        const applications = await Application.find({ applicant: seeker._id })
          .populate({ path: "job", select: "title location jobType" })
          .lean();

        return { ...seeker, applications };
      })
    );

    return res.status(200).json({ success: true, jobSeekers: jobSeekersWithDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const toggleCompanyVerification = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }
    company.isVerified = !company.isVerified;
    await company.save();
    return res.status(200).json({
      success: true,
      message: `Company ${company.isVerified ? "verified" : "unverified"} successfully`,
      isVerified: company.isVerified,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const deleteEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;

    const jobs = await Job.find({ created_by: employerId });
    const jobIds = jobs.map((j) => j._id);

    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ created_by: employerId });
    await Company.deleteOne({ userId: employerId });
    await User.findByIdAndDelete(employerId);

    return res.status(200).json({ success: true, message: "Employer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Application.deleteMany({ job: jobId });
    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId },
    });
    await Application.findByIdAndDelete(applicationId);
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const deleteJobSeeker = async (req, res) => {
  try {
    const { seekerId } = req.params;
    const applications = await Application.find({ applicant: seekerId });
    const appIds = applications.map((a) => a._id);

    await Job.updateMany(
      { applications: { $in: appIds } },
      { $pull: { applications: { $in: appIds } } }
    );
    await Application.deleteMany({ applicant: seekerId });
    await User.findByIdAndDelete(seekerId);

    return res.status(200).json({ success: true, message: "Job seeker deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};