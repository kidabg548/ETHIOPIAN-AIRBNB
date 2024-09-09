import { Link } from "react-router-dom";
import { fetchCurrentUserForVerification } from "../api-client";
import { useEffect, useState } from "react";

const VerificationStatus: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<{
      verified: boolean;
      isProfileComplete: boolean;
    } | null>(null);
  
    useEffect(() => {
      const fetchVerificationStatus = async () => {
        try {
          const user = await fetchCurrentUserForVerification();
          setVerificationStatus({
            verified: user.verified,
            isProfileComplete: user.isProfileComplete,
          });
        } catch (error) {
          console.error('Error fetching verification status:', error);
          // Handle errors appropriately, e.g., display an error message
        }
      };
  
      fetchVerificationStatus();
    }, []); // Only run once on mount
  
    if (!verificationStatus) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Verification Status</h2>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-md shadow">
            <h3>Profile Complete: {verificationStatus.isProfileComplete ? 'Yes' : 'No'}</h3>
          </div>
          <div className="p-4 bg-white rounded-md shadow">
            <h3>Verified: {verificationStatus.verified ? 'Yes' : 'No'}</h3>
          </div>
          {!verificationStatus.verified && (
            <div className="p-4 bg-white rounded-md shadow">
              <p>Please complete your profile to become verified.</p>
              <Link to="/manage-account/personal-details" className="bg-blue-500 text-white px-4 py-2 rounded">
                Complete Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default VerificationStatus;
  