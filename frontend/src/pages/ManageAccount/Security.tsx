import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaStar, FaBookmark, FaSignOutAlt } from 'react-icons/fa';
import { updatePassword } from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

const Security: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const navigate = useNavigate();
  const { showToast } = useAppContext(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    try {
      await updatePassword({ currentPassword, newPassword, confirmPassword });
      showToast({ message: "Password changed successfully!", type: "SUCCESS" });
      navigate('/manage-account');
    } catch (error: any) {
      showToast({ message: error.message || "Error updating password", type: "ERROR" });
    } finally {
      setLoading(false); // End loading state
    } 
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with improved styling */}
      <header className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center mb-8 shadow-lg rounded-md">
        <div className="flex items-center">
          <span className="text-white text-2xl font-semibold">HULUBEAND</span>
        </div>
        <div className="flex items-center relative">
          <Link to="/" className="text-white text-lg font-semibold mr-4 hover:underline">Home</Link>
          <button
            onClick={handleToggleDropdown}
            className="flex items-center px-4 py-2 font-bold text-white rounded-md hover:bg-blue-600"
          >
            <FaCog className="text-lg" />
          </button>
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
              style={{ top: '100%' }}
            >
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center"
                  onClick={() => handleNavigate("/manage-account")}
                >
                  <FaCog className="text-lg mr-2" />
                  Manage Account
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center"
                  onClick={() => handleNavigate("/reviews")}
                >
                  <FaStar className="text-lg mr-2" />
                  Reviews
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center"
                  onClick={() => handleNavigate("/saved")}
                >
                  <FaBookmark className="text-lg mr-2" />
                  Saved
                </button>
                <button
                  onClick={() => alert('Signed out!')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center"
                >
                  <FaSignOutAlt className="text-lg mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-md p-8"> {/* Increased padding */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Security Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password:</label>
            <div className="flex items-center mt-2">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="ml-2 px-2 py-1 bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300 focus:outline-none"
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
            <div className="flex items-center mt-2">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="ml-2 px-2 py-1 bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300 focus:outline-none"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password:</label>
            <div className="flex items-center mt-2">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 px-2 py-1 bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300 focus:outline-none"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <footer className="bg-blue-700 text-white py-4 px-6 mt-8">
        <div className="text-center">
          <p>© 2024 HULUBEAND. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Security;