import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/sendEmail.js";
import { isStrongPassword, validateEmail } from "../utils/validators.js";


export const sendRegisterOtp = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    const normalizedPhone = phoneNumber.trim();

const  existingPhoneNumber = await User.findOne({ phoneNumber: normalizedPhone });

if (existingPhoneNumber) {
  return res.status(400).json({
    message: "User already exists with this phone number",
    success: false,
  });
}

    if (!["jobseeker", "employer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
        success: false,
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email ID",
        success: false,
      });
    }

    let profilePictureUrl = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePictureUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailVerification.findOneAndUpdate(
      { email: normalizedEmail },
      {
        fullName,
        email: normalizedEmail,
        phoneNumber,
        password: hashedPassword,
        role,
        otp,
        otpExpiresAt,
        profilePicture: profilePictureUrl,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify Your JobFloyd Account</h2>
        <p>Hello ${fullName},</p>
        <p>Your JobFloyd verification code is:</p>
        <h1 style="letter-spacing: 4px; color: #0066FF;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: normalizedEmail,
      subject: "JobFloyd Email Verification Code",
      html,
    });

    return res.status(200).json({
      message: "Verification code sent to your email",
      success: true,
    });
  } catch (error) {
    console.log("sendRegisterOtp error:", error);
    return res.status(500).json({
      message: "Failed to send verification code",
      success: false,
      error: error.message,
    });
  }
};

export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pendingVerification = await EmailVerification.findOne({
      email: normalizedEmail,
    });

    if (!pendingVerification) {
      return res.status(404).json({
        message: "No pending verification found for this email",
        success: false,
      });
    }

    if (pendingVerification.otp !== otp) {
      return res.status(400).json({
        message: "Invalid verification code",
        success: false,
      });
    }

    if (pendingVerification.otpExpiresAt < new Date()) {
      await EmailVerification.deleteOne({ _id: pendingVerification._id });
      return res.status(400).json({
        message: "Verification code expired. Please request a new one",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await EmailVerification.deleteOne({ _id: pendingVerification._id });
      return res.status(400).json({
        message: "User already exists with this email ID",
        success: false,
      });
    }

    const newUser = new User({
      fullName: pendingVerification.fullName,
      email: pendingVerification.email,
      phoneNumber: pendingVerification.phoneNumber,
      password: pendingVerification.password,
      role: pendingVerification.role,
      isEmailVerified: true,
      profile: {
        profilePicture: pendingVerification.profilePicture || "",
      },
    });

    await newUser.save();
    await EmailVerification.deleteOne({ _id: pendingVerification._id });

    return res.status(201).json({
      message: "Email verified and account created successfully",
      success: true,
    });
  } catch (error) {
    console.log("verifyRegisterOtp error:", error);
    return res.status(500).json({
      message: "Verification failed",
      success: false,
      error: error.message,
    });
  }
};


const superAdminOtpStore = {};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Super Admin
    if (normalizedEmail === "jobfloyd.app@gmail.com") {
      const adminUser = await User.findOne({ email: normalizedEmail });
      if (!adminUser) {
        return res.status(400).json({ message: "Admin not found", success: false });
      }

      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password", success: false });
      }

     
      if (role !== "admin") {
        return res.status(400).json({
          message: "Please select the Admin role",
          success: false,
        });
      }

      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; 
      superAdminOtpStore[normalizedEmail] = { otp, expiresAt };

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>JobFloyd Super Admin Login</h2>
          <p>Your one-time login code is:</p>
          <h1 style="letter-spacing: 4px; color: #0066FF;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `;

      await sendEmail({
        to: normalizedEmail,
        subject: "JobFloyd Super Admin OTP",
        html,
      });

      return res.status(200).json({
        message: "OTP sent to admin email",
        success: true,
        requiresOtp: true,
      });
    }

    // Users 
    if (!role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: `Hello ${user.fullName}, your password is incorrect.`,
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: `Hello ${user.fullName}, Account does not match with your role.`,
        success: false,
      });
    }

    const tokenData = { id: user._id };
    const tokenExpiresInMs = 60 * 60 * 1000;
    const tokenExpiresAt = Date.now() + tokenExpiresInMs;

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const responseUser = await User.findById(user._id)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: [
          { path: "company" },
          { path: "applications", select: "applicant status" },
        ],
      });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: tokenExpiresInMs,
        sameSite: "strict",
        secure: false,
      })
      .json({
        message: "Hi " + user.fullName,
        success: true,
        responseUser,
        token,
        tokenExpiresAt,
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

export const verifySuperAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const record = superAdminOtpStore[normalizedEmail];

    if (!record) {
      return res.status(400).json({ message: "No OTP found. Please login again.", success: false });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (Date.now() > record.expiresAt) {
      delete superAdminOtpStore[normalizedEmail];
      return res.status(400).json({ message: "OTP expired. Please login again.", success: false });
    }

    delete superAdminOtpStore[normalizedEmail];

    const user = await User.findOne({ email: normalizedEmail }).select("-password");

    const tokenData = { id: user._id };
    const tokenExpiresInMs = 60 * 60 * 1000;
    const tokenExpiresAt = Date.now() + tokenExpiresInMs;

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1h" });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: tokenExpiresInMs,
        sameSite: "strict",
        secure: false,
      })
      .json({
        message: "Welcome, Super Admin!",
        success: true,
        responseUser: user,
        token,
        tokenExpiresAt,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};     

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { httpOnly: true, maxAge: 0 })
      .json({
        message: "Logged out successfully",
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

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, skills, bio } = req.body;

    if (!fullName && !email && !phoneNumber && !skills && !bio && !req.file) {
      return res.status(400).json({
        message: "Please fill the fields to update profile",
        success: false,
      });
    }

    const file = req.file;
    let cloudResponse = null;

    if (file) {
      const fileUri = getDataUri(file);

      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
        format: "pdf",
        access_mode: "public",
      });
    }

    let skillsList = [];
    if (skills) {
      skillsList = skills.split(",").map((skill) => skill.trim());
    }

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email.toLowerCase().trim();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsList;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeName = file.originalname;
    }

    await user.save();

    const responseUser = await User.findById(user._id)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: [
          { path: "company" },
          { path: "applications", select: "applicant status" },
        ],
      });

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      responseUser,
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


export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const alreadySaved = user.savedJobs.some(
      (savedJobId) => savedJobId.toString() === jobId.toString()
    );

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (savedJobId) => savedJobId.toString() !== jobId.toString()
      );
      await user.save();

      const updatedUser = await User.findById(userId)
        .select("-password")
        .populate({
          path: "savedJobs",
          populate: [
            { path: "company" },
            { path: "applications", select: "applicant status" },
          ],
        });

      return res.status(200).json({
        message: "Job removed from saved jobs",
        success: true,
        isSaved: false,
        user: updatedUser,
      });
    }

    user.savedJobs.push(jobId);
    await user.save();

    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: [
          { path: "company" },
          { path: "applications", select: "applicant status" },
        ],
      });

    return res.status(200).json({
      message: "Job saved successfully",
      success: true,
      isSaved: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("toggleSaveJob error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};


export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("savedJobs")
      .populate({
        path: "savedJobs",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "company" },
          { path: "applications", select: "applicant status" },
        ],
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      savedJobs: user.savedJobs || [],
    });
  } catch (error) {
    console.log("getSavedJobs error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: [
          { path: "company" },
          { path: "applications", select: "applicant status" },
        ],
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};