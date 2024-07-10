import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaCog, FaSignOutAlt, FaStar } from 'react-icons/fa';

import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { ReviewType, HotelType } from '../../../backend/shared/types';
import { Link } from 'react-router-dom';
import {  useMutation, useQueryClient } from 'react-query';

const Reviews = () => {
  const { isLoggedIn, showToast } = useAppContext();
  const navigate = useNavigate();
  const [fetchedReviews, setFetchedReviews] = useState<ReviewType[]>([]);
  const [fetchedHotels, setFetchedHotels] = useState<HotelType[]>([]);
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviews: ReviewType[] = await apiClient.fetchMyReviews();
        const hotels: HotelType[] = await apiClient.fetchMyHotels();

        setFetchedReviews(reviews);
        setFetchedHotels(hotels);
      } catch (error) {
        const errorMessage = (error as Error).message || 'An unknown error occurred';
        showToast({ message: `Error fetching reviews or hotels: ${errorMessage}`, type: 'ERROR' });
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, showToast]);

  // Function to get hotel by review's hotelId
  const getHotel = (hotelId: string) => {
    return fetchedHotels.find(h => h._id === hotelId) || null;
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
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Reviews</h1>

        {isLoggedIn && fetchedReviews.length > 0 ? (
          <div className="space-y-6">
            {fetchedReviews.map(review => {
              const hotel = getHotel(review.hotelId);
              return (
                <div key={review._id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                  <div className="flex">
                    {hotel?.imageUrls?.[0] && (
                      <img src={hotel.imageUrls[0]} alt="Hotel" className="w-48 h-32 object-cover rounded-l-lg" />
                    )}
                    <div className="p-4 flex-1">
                      <h2 className="text-xl font-semibold mb-2">{hotel?.name || 'Unknown Hotel'}</h2>

                      <div className="mb-4">
                        <p className="text-gray-600 font-medium">Overall Rating:</p>
                        <div className="flex items-center mt-2">
                          <div className="w-48 h-4 bg-gray-300 rounded-full overflow-hidden mr-2">
                            <div 
                              className="bg-yellow-500 h-full rounded-full"
                              style={{ width: `${((review.staffRating + review.facilitiesRating + review.cleanlinessRating + review.comfortRating + review.valueForMoneyRating + review.locationRating + review.freeWifiRating) / 7) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-medium">{((review.staffRating + review.facilitiesRating + review.cleanlinessRating + review.comfortRating + review.valueForMoneyRating + review.locationRating + review.freeWifiRating) / 7).toFixed(1)} / 10</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 font-medium">Category Ratings:</p>
                        <ul className="mt-2 list-disc list-inside text-gray-700">
                          <li>Staff: {review.staffRating} / 10</li>
                          <li>Facilities: {review.facilitiesRating} / 10</li>
                          <li>Cleanliness: {review.cleanlinessRating} / 10</li>
                          <li>Comfort: {review.comfortRating} / 10</li>
                          <li>Value for Money: {review.valueForMoneyRating} / 10</li>
                          <li>Location: {review.locationRating} / 10</li>
                          <li>Free Wifi: {review.freeWifiRating} / 10</li>
                        </ul>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 font-medium">Your Comment:</p>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>

                      {review.images && review.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {review.images.map((image, index) => (
                            <img key={index} src={image} alt={`Review image ${index}`} className="w-24 h-24 object-cover rounded-md" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center">You haven't written any reviews yet.</p>
        )}
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 mt-12 rounded-t-lg">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} HULUBEAND. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Reviews;