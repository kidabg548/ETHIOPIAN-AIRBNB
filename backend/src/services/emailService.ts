import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Using port 587 for TLS
  secure: false, // Set to true if you use port 465 for SSL
  auth: {
    user: 'mutation.forlife06@gmail.com',
    pass: 'lqruxxzlxzogqqfh' // App password for Gmail
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
