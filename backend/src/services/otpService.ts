import crypto from 'crypto';

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Define expiry for OTP (e.g., 10 minutes)
// services/otpService.js


export const isOtpExpired = (createdAt: Date): boolean => {
  // OTP expires after 10 minutes
  const expiryTime = new Date(createdAt);
  expiryTime.setMinutes(expiryTime.getMinutes() + 10);
  return new Date() > expiryTime;
};
  
