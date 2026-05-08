import nodemailer from "nodemailer";
import { Resend } from "resend";

const sendEmail = async ({ to, subject, html }) => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

  if (process.env.NODE_ENV === "production") {
    console.log("Using Resend...");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "JobFloyd <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log("Email sent via Resend!");
  } else {
    console.log("Using Nodemailer...");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"JobFloyd" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent via Nodemailer!");
  }
};

export default sendEmail;