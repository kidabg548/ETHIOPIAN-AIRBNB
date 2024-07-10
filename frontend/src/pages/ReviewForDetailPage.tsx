import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { UserType, ReviewType } from '../../../backend/shared/types'; 
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ReviewForDetailPage = () => {
  const { hotelId } = useParams();

  // Fetch reviews by hotelId
  const { data: reviews = [] } = useQuery<ReviewType[]>(
    ["fetchReviewsByHotelId", hotelId],
    () => apiClient.fetchReviewsByHotelId(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  // Fetch all users using fetchAllUsers API
  const { data: users = [] } = useQuery<UserType[]>(
    "fetchAllUsers",
    apiClient.fetchAllUsers,
    {
      enabled: reviews.length > 0, // Enables this query only if there are reviews
    }
  );

  // Helper function to get user information by userId
  const getUserInfo = (userId: string): UserType | undefined => {
    return users.find((user: UserType) => user._id === userId);
  };

  // Calculate category averages
  const getCategoryAverage = (ratingCategory: keyof ReviewType) => {
    const ratings = reviews
      ?.map(review => review[ratingCategory])
      .filter((rating): rating is number => typeof rating === 'number');

    if (!ratings || ratings.length === 0) {
      return null; 
    } 

    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  // Function to get rating message based on averageRating
  const getRatingMessage = (averageRating: number) => {
    if (averageRating >= 9) {
      return "Exceptional";
    } else if (averageRating >= 8) {
      return "Excellent";
    } else if (averageRating >= 7) {
      return "Very Good";
    } else if (averageRating >= 6) {
      return "Good";
    } else if (averageRating >= 5) {
      return "Average";
    } else if (averageRating >= 4) {
      return "Below Average";
    } else if (averageRating >= 3) {
      return "Poor";
    } else if (averageRating >= 2) {
      return "Very Poor";
    } else {
      return "Terrible";
    }
  };

  // State for review pagination
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex(prevIndex => Math.min(prevIndex + 1, reviews.length - 1));
  };

  const handlePrevious = () => {
    setStartIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const currentReview = reviews[startIndex];
  const user = getUserInfo(currentReview?.userId || "");

  // Check if there are no ratings
  const hasRatings = reviews.length > 0;
  const overallAverage = hasRatings
    ? reviews.reduce((acc, review) => {
        return acc + (review.staffRating + review.facilitiesRating + review.cleanlinessRating + review.comfortRating + review.valueForMoneyRating + review.locationRating + review.freeWifiRating) / 7;
      }, 0) / reviews.length
    : 0;

  // Find the highest-rated category
  const highestRatedCategory =  Object.entries({
    "Staff": getCategoryAverage("staffRating"),
    "Facilities": getCategoryAverage("facilitiesRating"),
    "Cleanliness": getCategoryAverage("cleanlinessRating"),
    "Comfort": getCategoryAverage("comfortRating"),
    "Value for Money": getCategoryAverage("valueForMoneyRating"),
    "Location": getCategoryAverage("locationRating"),
    "Free WiFi": getCategoryAverage("freeWifiRating")
  }).reduce((a, b) => (parseFloat(a[1] || "0") > parseFloat(b[1] || "0") ? a : b))[0];

  // State for the slide-in panel
  const [showPanel, setShowPanel] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false); // State for ticket modal
  const [ticketNumber, setTicketNumber] = useState("");
  const navigate = useNavigate(); // Get the navigate function for redirection

  const handleOverallRatingClick = () => {
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleWriteReviewClick = () => {
    setShowTicketModal(true); // Open the ticket modal
  };

  const handleTicketSubmit = async () => {
    try {
      const booking = await apiClient.fetchBookingByTicket(ticketNumber);
      
      if (booking) {
        // Check if the current date is after the checkout date
        if (new Date() > new Date(booking.checkOut)) {
          navigate(`/hotel/${hotelId}/${booking._id}/review`); // Redirect to review page
        } else {
          alert("You cannot leave a review before checking out.");
        }
      } else {
        alert("Invalid booking ticket number.");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
  };
  return (
    <div className="space-y-4 relative"> {/* Make the container relative */}
      <h2 className="text-2xl font-bold mt-6">Guest reviews</h2>

      {/* Overall Rating Display with Panel Trigger */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={handleOverallRatingClick}>
        {hasRatings ? (
          <div>
            <span className="text-lg font-bold text-white p-2 bg-blue-500 rounded">{overallAverage.toFixed(1)}</span> 
            <span className="text-sm text-gray-600"> . ({getRatingMessage(overallAverage)})</span>
            <span className="text-sm text-gray-600"> - {reviews.length} reviews</span>
          </div>
        ) : (
          <p className="text-gray-600">No Ratings Yet</p>
        )}
      </div>

      {/* Reviews Section */}
      {hasRatings ? (
        <div className="p-4 border rounded-md shadow-sm">
          <div className="flex items-center space-x-4">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {user?.firstName ? (
                  <span className="text-lg font-bold text-gray-700">
                    {user?.firstName.charAt(0)}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-gray-700">?</span>
                )}
              </div>
            )}

            <div>
              <p className="font-bold">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : 'Anonymous'}
              </p>
              <div className="flex">
                {Array.from({ length: currentReview.staffRating }).map((_, index) => (
                  <div key={index} className="text-yellow-400">★</div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4">{currentReview.comment}</p>

          {/* Review Navigation Arrows */}
          {reviews.length > 1 && (
            <div className="flex justify-between mt-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-md"
                onClick={handlePrevious}
                disabled={startIndex === 0}
              >
                <FaArrowLeft />
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-md"
                onClick={handleNext}
                disabled={startIndex === reviews.length - 1}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No Reviews Yet</p>
      )}

      {/* Highest Rated Category */}
      {hasRatings && (
        <div className="mt-4 p-4 border rounded-md shadow-sm">
          <p className="font-bold text-lg">Highest Rated Category:</p>
          <p className="text-gray-600">{highestRatedCategory}: {getCategoryAverage(highestRatedCategory as keyof ReviewType)}</p> 
        </div>
      )}

      {/* Slide-in Panel */}
      {showPanel && (
        <div 
          className="fixed z-50 top-0 right-0 h-full w-3/5 bg-white shadow-lg rounded-lg transition-transform duration-300 ease-in-out"
          style={{ transform: showPanel ? 'translateX(0)' : 'translateX(100%)' }} 
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the panel from closing it
        >
          <div className="p-6"> 
            <h3 className="text-xl font-semibold">Overall Rating</h3>
            <p className="text-gray-600">
              This hotel has an overall rating of{" "}
              <span className="font-bold text-blue-600">
                {overallAverage.toFixed(1)}
              </span>{" "}
              out of 10.
            </p>
            <p className="mt-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleWriteReviewClick}>
                Write a Review
              </button>
            </p>
          </div>

          <button className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-md" onClick={handleClosePanel}>
            Close
          </button>
        </div>
      )}

      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => handleCloseTicketModal()}>
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold">Enter Booking Ticket</h3>
            <p className="text-gray-600">
              Please enter your booking ticket number to proceed with writing a review.
            </p>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleTicketSubmit}>
              Submit
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-2" onClick={handleCloseTicketModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForDetailPage;