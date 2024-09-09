import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  secure: false, // Set to true for port 465 (SSL/TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASScd
  }
});

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log("Sending email to:", email);
  console.log("OTP:", otp);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
