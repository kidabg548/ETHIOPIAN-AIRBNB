import { Request, Response } from 'express';
import { generateOtp,isOtpExpired } from '../services/otpService';
import { sendOtpEmail } from '../services/emailService';
import User from '../models/user';
import Otp from '../models/otp';


// controllers/emailVerificationController.ts
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  try {
    // Generate OTP
    const otp = generateOtp();

    // Save OTP in the database
    const newOtp = new Otp({ email, otp });
    await newOtp.save();

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error:any) {
    console.error('Error sending OTP:', error); // Detailed error logging
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};




export const verifyOtp = async (req: Request, res: Response) => {
  const { userId, otp } = req.body; // Get userId and OTP from the request body

  try {
    // Find the user document by ID
    const userDocument = await User.findById(userId); 

    if (!userDocument) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch OTP from the database
    const otpRecord = await Otp.findOne({ email: userDocument.email, otp }); 

    if (!otpRecord || isOtpExpired(otpRecord.createdAt)) { 
      return res.status(400).json({ message: 'Invalid or expired OTP' }); 
    }

    // Mark user as verified
    userDocument.isEmailVerified = true; 
    await userDocument.save(); 

    // Optionally delete OTP record after verification
    await Otp.deleteOne({ email: userDocument.email, otp }); 

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};