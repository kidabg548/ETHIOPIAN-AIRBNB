import React, { useEffect, useState } from "react";
import { fetchCurrentUser, fetchCurrentUserForVerification } from "../api-client"; // Adjust import based on your structure
import { useNavigate } from "react-router-dom";
interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
}

interface VerificationStatus extends UserType {
  verified: boolean;
  isProfileComplete: boolean;
}

const VerificationStatusPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        // Fetch verification details
        const verificationData = await fetchCurrentUserForVerification();

        // Fetch user details
        const userDetails = await fetchCurrentUser();

        // Combine the results
        const combinedStatus: VerificationStatus = {
          verified: verificationData.verified,
          isProfileComplete: verificationData.isProfileComplete,
          firstName: userDetails.firstName || '', // Default to empty string if undefined
          lastName: userDetails.lastName || '',   // Default to empty string if undefined
          email: userDetails.email || '',         // Default to empty string if undefined
          phoneNumber: userDetails.phoneNumber || '', // Default to empty string if undefined
          profilePicture: userDetails.profilePicture || null, // Default to null if undefined
        };

        setVerificationStatus(combinedStatus);
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    };

    fetchVerificationStatus();
  }, []);

  if (!verificationStatus) {
    return <div>Loading...</div>;
  }

  const { firstName, lastName, email, phoneNumber, profilePicture } = verificationStatus;

  const isNameComplete = firstName && lastName;
  const isPhotoComplete = profilePicture && profilePicture !== "null";
  const isEmailComplete = email;
  const isPhoneComplete = phoneNumber;

  const stepsCompleted = [
    isNameComplete,
    isPhotoComplete,
    isEmailComplete,
    isPhoneComplete,
  ].filter(Boolean).length;

  const totalSteps = 4;
  const progressPercentage = (stepsCompleted / totalSteps) * 100;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="rounded-full w-full h-full object-cover" />
            ) : (
              <>
                {firstName[0]}
                {lastName[0]}
              </>
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">Welcome back, {firstName}!</h1>
            <div className="flex items-center mt-2">
              <span className={`inline-block w-4 h-4 rounded-full ${verificationStatus.verified ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="ml-2">{verificationStatus.verified ? "Verified" : "Unverified"}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{stepsCompleted}/{totalSteps} steps completed</p>
        </div>

        <p className="mt-6 text-lg">To become a verified host, complete the steps below:</p>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div 
            className={`p-4 rounded-lg border-2 ${isNameComplete ? 'border-green-500' : 'border-red-500'}`} 
            onClick={() => !isNameComplete && navigate("/manage-account/personal-details")}
          >
            <h2 className="text-xl font-semibold">Your name</h2>
            <p>First name, Last name</p>
            <div className={`mt-4 text-lg font-bold ${isNameComplete ? 'text-green-500' : 'text-red-500'}`}>
              {isNameComplete ? "Great" : "Incomplete"}
            </div>
          </div>
          <div 
            className={`p-4 rounded-lg border-2 ${isPhotoComplete ? 'border-green-500' : 'border-red-500'}`} 
            onClick={() => {
              console.log("Navigating to /ManageAccount/PersonalDetails");
              !isPhotoComplete && navigate("/manage-account/personal-details");
            }}
          >
            <h2 className="text-xl font-semibold">Photo</h2>
            <p>Upload your profile photo</p>
            <div className={`mt-4 text-lg font-bold ${isPhotoComplete ? 'text-green-500' : 'text-red-500'}`}>
              {isPhotoComplete ? "Great" : <button className="bg-blue-500 text-white px-4 py-2 rounded">Upload now</button>}
            </div>
          </div>
          <div 
            className={`p-4 rounded-lg border-2 ${isEmailComplete ? 'border-green-500' : 'border-red-500'}`} 
            onClick={() => !isEmailComplete && navigate("/manage-account/personal-details")}>     
                   <h2 className="text-xl font-semibold">Email</h2>
            <p>Verify your email</p>
            <div className={`mt-4 text-lg font-bold ${isEmailComplete ? 'text-green-500' : 'text-red-500'}`}>
              {isEmailComplete ? "Great" : "Incomplete"}
            </div>
          </div>
          <div 
            className={`p-4 rounded-lg border-2 ${isPhoneComplete ? 'border-green-500' : 'border-red-500'}`} 
            onClick={() => !isPhoneComplete && navigate("/manage-account/personal-details")}
          >            <h2 className="text-xl font-semibold">Phone number</h2>
            <p>Verify your phone number</p>
            <div className={`mt-4 text-lg font-bold ${isPhoneComplete ? 'text-green-500' : <button className="bg-blue-500 text-white px-4 py-2 rounded">Add your phone number</button>}`}>
              {isPhoneComplete ? "Great" : "Incomplete"}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-600">We'll check the Verified Host criteria on a daily basis. Once you achieve the requirements, you'll become a Verified Host.</p>
      </div>
    </div>
  );
};

export default VerificationStatusPage;
