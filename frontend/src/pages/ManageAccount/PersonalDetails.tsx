import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdCard,
  FaCog,
  FaStar,
  FaBookmark,
  FaSignOutAlt,
  FaCheck,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchCurrentUser, updatePersonalDetails } from "../../api-client";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";

export type PersonalDetailsFormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date | null;
  nationality?: string;
  gender?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  passportDetails?: {
    firstName?: string;
    lastName?: string;
    issuingCountry?: string;
    number?: string;
    expiryDate?: Date | null;
  };
  profilePicture?: string | File | null;
  isEmailVerified?: boolean;
};

const PersonalDetails: React.FC = () => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonalDetailsFormData>({});
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otp, setOtp] = useState(""); // State for OTP input
  const [isOTPSent, setIsOTPSent] = useState(false); // State to check if OTP has been sent
  const [isOTPVerified, setIsOTPVerified] = useState(false); // State to check if OTP has been verified
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const navigate = useNavigate();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate("/login");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  const handleEditClick = (field: string) => {
    setIsEditing(field);
  };

  const handleSendOTP = async () => {
    setIsVerifyingEmail(true);
    setError("");

    if (!formData.email) {
      setError("Email is required to send OTP.");
      setIsVerifyingEmail(false);
      return;
    }

    try {
      const response = await apiClient.sendEmailVerification(formData.email);
      if (response.message === "OTP sent successfully") {
        setIsOTPSent(true);
        showToast({ message: "OTP sent successfully.", type: "SUCCESS" });
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifyingEmail(true);
    setError("");

    if (!formData.email || !userId) {
      setError("Email and User ID are required to verify OTP.");
      setIsVerifyingEmail(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      console.log("API Response (before parsing):", response);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response (parsed):", data);
        // Handle successful verification
        setIsOTPVerified(true);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error during OTP verification:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Function to handle OTP input change
  const handleOTPChange = (e: any) => {
    setOtp(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const [field, subField] = name.split(".") as [
      keyof PersonalDetailsFormData,
      string | undefined
    ];

    if (subField) {
      setFormData({
        ...formData,
        [field]: {
          ...(formData[field] as any), // Type assertion here
          [subField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleDateChange = (date: Date | null, field: string) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Assuming you have imported updatePersonalDetails from your apiClient
      await updatePersonalDetails({ ...formData, profilePicture }); // Include profile picture in update
      alert("Personal details updated!");
    } catch (error) {
      console.error(error);
      alert("Error updating personal details. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteAccountClick = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      await apiClient.deactivateAccount(); // API call to deactivate account

      // Clear any local authentication state or tokens
      showToast({ message: "Account deleted successfully", type: "SUCCESS" });
      navigate("/"); // Navigate the user back to the homepage
    } catch (error: any) {
      showToast({ message: error.message, type: "ERROR" });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await fetchCurrentUser();
        if (userDetails.dateOfBirth) {
          userDetails.dateOfBirth = new Date(userDetails.dateOfBirth);
          
        }

        if (userDetails.passportDetails?.expiryDate) {
          userDetails.passportDetails.expiryDate = new Date(
            userDetails.passportDetails.expiryDate
          );
        }
        const convertedDetails: PersonalDetailsFormData = {
          ...userDetails,
          profilePicture: userDetails.profilePicture || null, // Set profilePicture from userDetails
          isEmailVerified: userDetails.isEmailVerified || false,
        };

        setIsOTPVerified(userDetails.isEmailVerified || false);
        setFormData(convertedDetails);

        // Set the userId in state for later use in OTP verification
        if (userDetails._id) {
          setUserId(userDetails._id); // Ensure userId is stored in the state
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Handle errors appropriately, like displaying an error message
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-600 text-white py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white text-xl font-semibold">HULUBEAND</span>
        </div>
        <div className="flex items-center relative">
          <Link to="/" className="text-white text-xl font-semibold mr-4">
            Home
          </Link>
          <button
            onClick={toggleDropdown}
            className="flex items-center px-4 py-2 font-bold text-white text-lg"
          >
            <FaCog className="text-xl" />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 origin-top-right"
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center text-lg"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/manage-account");
                  }}
                >
                  <FaCog className="text-lg mr-2" />
                  Manage Account
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center text-lg"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/reviews");
                  }}
                >
                  <FaStar className="text-lg mr-2" />
                  Reviews
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center text-lg"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/saved");
                  }}
                >
                  <FaBookmark className="text-lg mr-2" />
                  Saved
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center text-lg"
                >
                  <FaSignOutAlt className="text-lg mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="mb-6 mt-3 ">
        <div className="mb-8 flex items-center justify-between">
          {" "}
          {/* Flex for side by side */}
          <div>
            <h2 className="text-3xl font-bold">Personal Details</h2>
            <p className="text-gray-700 mt-2">
              Update your information and find out how it's used.
            </p>
          </div>
          <div className="flex items-center mb-3">
            {/* Flex for side by side */}
            <div className="-mb-2 mr-2">
              <div className="flex justify-start">
                <label
                  htmlFor="profilePictureInput"
                  className="relative cursor-pointer"
                >
                  <input
                    type="file"
                    id="profilePictureInput"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                    {previewUrl ||
                    typeof formData.profilePicture === "string" ? (
                      <img
                        src={
                          previewUrl ||
                          (typeof formData.profilePicture === "string"
                            ? formData.profilePicture
                            : undefined)
                        } // Ensure src is a string
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full rounded-full bg-blue-500 font-bold relative">
                        <span className="text-5xl font-bold text-white">
                          {formData.firstName ? formData.firstName[0] : ""}
                        </span>
                        <FaCamera className="absolute text-white text-2xl bottom-2 left-1/2 transform -translate-x-1/2" />{" "}
                        {/* Positioned at the bottom center */}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[
            {
              label: "Name",
              field: "name",
              icon: <FaUserEdit />,
              value: `${formData.firstName} ${formData.lastName}`,
            },
            {
              label: "Email Address",
              field: "email",
              icon: <FaEnvelope />,
              value: formData.email,
            },
            {
              label: "Phone Number",
              field: "phoneNumber",
              icon: <FaPhone />,
              value: formData.phoneNumber,
            },
            {
              label: "Date of Birth",
              field: "dateOfBirth",
              icon: <FaCalendarAlt />,
              value: formData.dateOfBirth
                ? (formData.dateOfBirth as Date).toLocaleDateString()
                : "N/A",
            },
            {
              label: "Nationality",
              field: "nationality",
              icon: <FaGlobe />,
              value: formData.nationality,
            },
            {
              label: "Gender",
              field: "gender",
              icon: <FaUserEdit />,
              value: formData.gender,
            },
            {
              label: "Address",
              field: "address",
              icon: <FaMapMarkerAlt />,
              value: formData.address
                ? `${formData.address.street || ""} ${
                    formData.address.city || ""
                  }, ${formData.address.state || ""} ${
                    formData.address.postalCode || ""
                  }`
                : "N/A",
            },
            {
              label: "Passport Details",
              field: "passportDetails",
              icon: <FaIdCard />,
              value: formData.passportDetails
                ? `${formData.passportDetails.firstName || ""} ${
                    formData.passportDetails.lastName || ""
                  }`
                : "N/A",
            },
          ].map((item) => (
            <div
              key={item.field}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleEditClick(item.field)}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center text-gray-600">
                  {item.icon}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-semibold">{item.label}</h3>
                  <p className="text-gray-600">{item.value || "N/A"}</p>
                </div>
                <div className="flex items-center">
                  <FaUserEdit className="text-gray-600 text-lg" />
                </div>
              </div>
              {isEditing === item.field && (
                <form onSubmit={handleSubmit} className="mt-4">
                  {item.field === "name" && (
                    <>
                      <label className="block mb-2">
                        First Name
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Last Name
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                    </>
                  )}
                  {item.field === "email" && (
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:bg-gray-50 transition">
                      {/* Verification Status Indicator */}
                      {isOTPVerified && (
                        <div className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded mb-4 flex items-center">
                          <FaCheck className="mr-2" /> Email Verified
                        </div>
                      )}

                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 flex items-center justify-center text-gray-600">
                          {item.icon}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-semibold">
                            {item.label}
                          </h3>
                          <div className="flex items-center">
                            <p className="text-gray-600">
                              {formData.email || "N/A"}
                            </p>
                            {isOTPVerified && (
                              <FaCheck className="text-green-500 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditing === item.field && (
                        <div>
                          {!isOTPVerified && (
                            <>
                              <label className="block mb-2">
                                Email Address
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email || ""}
                                  onChange={handleChange}
                                  className="block w-full mt-1 border rounded p-2"
                                />
                              </label>
                              {formData.email &&
                                !isVerifyingEmail &&
                                !isOTPSent && (
                                  <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded mt-2 cursor-pointer"
                                    onClick={handleSendOTP}
                                  >
                                    Send Verification OTP
                                  </button>
                                )}

                              {isOTPSent && (
                                <div>
                                  <label className="block mb-2">
                                    Enter OTP
                                    <input
                                      type="text"
                                      name="otp"
                                      value={otp}
                                      onChange={handleOTPChange}
                                      className="block w-full mt-1 border rounded p-2"
                                    />
                                  </label>
                                  <button
                                    className="bg-green-600 text-white px-4 py-2 rounded mt-2 cursor-pointer"
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifyingEmail}
                                  >
                                    Verify OTP
                                  </button>
                                </div>
                              )}

                              {isVerifyingEmail && !isOTPSent && (
                                <div className="text-gray-600">
                                  Sending verification OTP...
                                </div>
                              )}

                              {isVerifyingEmail && isOTPSent && (
                                <div className="text-gray-600">
                                  Verifying OTP...
                                </div>
                              )}

                              {error && (
                                <div className="text-red-600 mt-2">{error}</div>
                              )}
                            </>
                          )}

                          {isOTPVerified && (
                            <div className="text-green-600 mt-2">
                              Email Verified Successfully!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {item.field === "phoneNumber" && (
                    <label className="block mb-2">
                      Phone Number
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full mt-1 border rounded p-2"
                      />
                    </label>
                  )}
                  {item.field === "dateOfBirth" && (
                    <label className="block mb-2">
                      Date of Birth
                      <DatePicker
                        selected={formData.dateOfBirth}
                        onChange={(date) =>
                          handleDateChange(date, "dateOfBirth")
                        }
                        className="block w-full mt-1 border rounded p-2"
                        dateFormat="MM/dd/yyyy"
                      />
                    </label>
                  )}
                  {item.field === "nationality" && (
                    <label className="block mb-2">
                      Nationality
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="block w-full mt-1 border rounded p-2"
                      />
                    </label>
                  )}
                  {item.field === "gender" && (
                    <label className="block mb-2">
                      Gender
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full mt-1 border rounded p-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </label>
                  )}
                  {item.field === "address" && (
                    <>
                      <label className="block mb-2">
                        Country
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address?.country}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Address
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address?.street}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Town/City
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address?.city}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Postal Code
                        <input
                          type="text"
                          name="address.postalCode"
                          value={formData.address?.postalCode}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                    </>
                  )}
                  {item.field === "passportDetails" && (
                    <>
                      <label className="block mb-2">
                        First Name
                        <input
                          type="text"
                          name="passportDetails.firstName"
                          value={formData.passportDetails?.firstName}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Last Name
                        <input
                          type="text"
                          name="passportDetails.lastName"
                          value={formData.passportDetails?.lastName}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Issuing Country
                        <input
                          type="text"
                          name="passportDetails.issuingCountry"
                          value={formData.passportDetails?.issuingCountry}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Passport Number
                        <input
                          type="text"
                          name="passportDetails.number"
                          value={formData.passportDetails?.number}
                          onChange={handleChange}
                          className="block w-full mt-1 border rounded p-2"
                        />
                      </label>
                      <label className="block mb-2">
                        Expiry Date
                        <DatePicker
                          selected={formData.passportDetails?.expiryDate}
                          onChange={(date) =>
                            handleDateChange(date, "passportDetails.expiryDate")
                          }
                          className="block w-full mt-1 border rounded p-2"
                          dateFormat="MM/dd/yyyy"
                        />
                      </label>
                    </>
                  )}
                  {item.field === "profilePicture" && (
                    <div className="mb-4">
                      <div className="flex justify-start">
                        <label
                          htmlFor="profilePictureInput"
                          className="relative cursor-pointer"
                        >
                          <input
                            type="file"
                            id="profilePictureInput"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-300">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                                <span className="text-2xl font-bold text-gray-700">
                                  {formData.firstName
                                    ? formData.firstName[0]
                                    : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Account</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={closeDeleteModal}
                >
                  No
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleConfirmDeleteAccount}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-500 transition duration-200"
            onClick={handleDeleteAccountClick}
          >
            Delete Account
          </button>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2024 HULUBEAND. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default PersonalDetails;
