import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCog, FaStar, FaBookmark, FaSignOutAlt } from 'react-icons/fa';

import * as apiClient from '../api-client';
import DetailCard from '../components/DetailsCard';
import { useAppContext } from '../contexts/AppContext';
import { HotelType, SavedHotelType } from '../../../backend/shared/types';
import { useMutation, useQueryClient } from 'react-query';

const Saved = () => {
  const { isLoggedIn, showToast } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [fetchedHotels, setFetchedHotels] = useState<HotelType[]>([]);

  useEffect(() => {
    const fetchSavedHotels = async () => {
      try {
        const savedHotels: SavedHotelType[] = await apiClient.fetchSavedHotels();

        const hotels: HotelType[] = savedHotels.map(savedHotel => {
          const hotel = savedHotel.hotelId as HotelType;
          return hotel;
        });

        setFetchedHotels(hotels);
      } catch (error) {
        const errorMessage = (error as Error).message || 'An unknown error occurred';
        showToast({ message: `Error fetching saved hotels: ${errorMessage}`, type: 'ERROR' });
      }
    };

    if (isLoggedIn) {
      fetchSavedHotels();
    }
  }, [isLoggedIn, showToast]);

 

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveHotel = async (hotelId: string) => {
    try {
      await apiClient.unsaveHotel(hotelId);
      setFetchedHotels(prevHotels => prevHotels.filter(hotel => hotel._id !== hotelId));
      showToast({ message: "Hotel removed from saved list.", type: "SUCCESS" });
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred';
      showToast({ message: `Error removing hotel: ${errorMessage}`, type: 'ERROR' });
    }
  };

  const handleCardClick = (hotelId: string) => {
    navigate(`/detail/${hotelId}`);
  };

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate("/login"); // Redirect to login page after sign out
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };


  return (
    <div className="container mx-auto p-6">
      <header className="bg-blue-600 text-white py-4 px-4 flex justify-between items-center shadow-lg">
        <span className="text-white text-xl font-semibold">HULUBEAND</span>
        <div className="flex items-center relative">
          <Link to="/" className="text-white text-lg font-medium mr-4">Home</Link>
          <button
            onClick={toggleDropdown}
            className="flex items-center px-4 py-2 font-bold text-white text-lg"
          >
            <FaCog className="text-xl" />
          </button>
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 origin-top-right"
            >
              <ul className="py-1">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center text-lg"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/manage-account");
                    }}
                  >
                    <FaCog className="text-lg mr-2" />
                    Manage Account
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center text-lg"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/reviews");
                    }}
                  >
                    <FaStar className="text-lg mr-2" />
                    Reviews
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center text-lg"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/saved");
                    }}
                  >
                    <FaBookmark className="text-lg mr-2" />
                    Saved
                  </button>
                </li>
                <li>
                  <button
                 onClick={handleSignOut}
                   className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center text-lg"
                  >
                    <FaSignOutAlt className="text-lg mr-2" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="my-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Saved Hotels</h1>

        {isLoggedIn && fetchedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fetchedHotels.map((hotel) => (
              <div
                key={hotel._id}
                className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleCardClick(hotel._id)}
              >
                <DetailCard
                  hotel={hotel}
                  removeFromSaved={handleRemoveHotel}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">You haven't saved any hotels yet. Start browsing and save your favorites!</p>
        )}
      </main>

      <footer className="bg-blue-600 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} HULUBEAND. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Saved;
