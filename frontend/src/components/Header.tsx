import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import logo from "../assets/logo.png"; // Assume you have a logo image
import { fetchCurrentUserForVerification } from "../api-client"; // Adjust import based on your structure

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfileCompleteness = async () => {
      try {
        const verificationData = await fetchCurrentUserForVerification();
        setIsProfileComplete(verificationData.isProfileComplete);
      } catch (error) {
        console.error("Error fetching profile completeness:", error);
      }
    };

    if (isLoggedIn) {
      checkProfileCompleteness();
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <Link to="/">
          <h2 style={{ color: "blue", fontWeight: "bold",fontSize:30 }}>HULU-BEAND </h2>          </Link>
        </div>

        <nav className="flex space-x-4">
          {isLoggedIn ? (
            <Link
              to={isProfileComplete ? "/list-property" : "/verification-status"}
              className="flex items-center px-4 py-2 rounded-md hover:shadow-md transition duration-300"
              style={{
                backgroundColor: "#f5f5f5", // Light gray background
                color: "#333", // Dark gray text color
                border: "1px solid #ddd", // Light gray border
              }}
            >
              <span className="font-bold">List Your Property</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </Link>
          ) : (
            <Link
              to="/signin"
              className="flex items-center px-4 py-2 rounded-md hover:shadow-md transition duration-300"
              style={{
                backgroundColor: "#f5f5f5", // Light gray background
                color: "#333", // Dark gray text color
                border: "1px solid #ddd", // Light gray border
              }}
            >
              <span className="font-bold">List Your Property</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link
                className="flex items-center text-gray-800 px-4 py-2 font-bold rounded hover:bg-gray-200 transition duration-300"
                to="/my-bookings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M9 12h6m-6 4h6m-3 4h6m-6-8h6"
                  />
                </svg>
                My Bookings
              </Link>
              <Link
                className="flex items-center text-gray-800 px-4 py-2 font-bold rounded hover:bg-gray-200 transition duration-300"
                to="/my-hotels"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2 2m0-6l2 2m6-6h6M9 3h6m-6 12h6m-3 4h6m-6-8h6"
                  />
                </svg>
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/signin"
              className="flex items-center text-blue-600 bg-gray-100 px-4 py-2 font-bold rounded hover:bg-gray-200 transition duration-300"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
