import User from "../models/user.model.js";
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

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
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

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: false,
      })
      .json({
        message: "Hi " + user.fullName,
        success: true,
        responseUser,
        token,
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

    const responseUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

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

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

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