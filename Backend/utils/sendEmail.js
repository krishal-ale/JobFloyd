import nodemailer from "nodemailer";
import { Resend } from "resend";

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === "production") {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "JobFloyd <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } else {
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
  }
};

export default sendEmail;