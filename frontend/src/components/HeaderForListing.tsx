import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { useAppContext } from '../contexts/AppContext'; 
import * as apiClient from "../api-client";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken');
      showToast({ message: 'Signed Out!', type: 'SUCCESS' });
      navigate('/login');
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-white text-xl font-semibold">HULUBEAND</span>
      </div>
      <div className="flex items-center relative">
        <Link to="/" className="text-white text-xl font-semibold mr-4">Home</Link>
        <button
          onClick={toggleDropdown}
          className="flex items-center px-4 py-2 font-bold text-white relative"
        >
          <FaCog className="text-lg" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
            style={{ top: '100%' }}
          >
            <div className="py-1">
              <button
                onClick={handleSignOut}
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
  );
};

export default Header;