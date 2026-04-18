import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
    resume: {
      url: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
    },
    acceptedDetails: {
      interviewDate: { type: String, default: "" },
      interviewTime: { type: String, default: "" },
      interviewLocation: { type: String, default: "" },
      jobTime: { type: String, default: "" },
      startingFrom: { type: String, default: "" },
      contactEmail: { type: String, default: "" },
      contactNumber: { type: String, default: "" },
      moreMessage: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;