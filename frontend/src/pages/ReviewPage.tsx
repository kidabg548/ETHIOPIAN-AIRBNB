import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { UserType, ReviewType } from '../../../backend/shared/types'; 

const ReviewPage = () => {
  const { hotelId } = useParams();

  // Fetch reviews by hotelId
  const { data: reviews } = useQuery<ReviewType[]>(
    ["fetchReviewsByHotelId", hotelId],
    () => apiClient.fetchReviewsByHotelId(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  // Fetch all users using fetchAllUsers API
  const { data: users } = useQuery<UserType[]>(
    "fetchAllUsers",
    () => apiClient.fetchAllUsers(),
    {
      enabled: !!reviews,
    }
  );

  // Helper function to get user information by userId
  const getUserInfo = (userId: string): UserType | undefined => {
    return users?.find((user: UserType) => user._id === userId);
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

  // Render loading state or reviews
  if (!reviews || !users) {
    return <p>Loading reviews...</p>;
  }

  // Check if there are no ratings
  const hasRatings = reviews.length > 0;
  const overallAverage = hasRatings
    ? reviews.reduce((acc, review) => {
        return acc + (review.staffRating + review.facilitiesRating + review.cleanlinessRating + review.comfortRating + review.valueForMoneyRating + review.locationRating + review.freeWifiRating) / 7;
      }, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mt-6">Guest reviews</h2>

      {/* Overall Rating Display */}
      <div className="flex items-center gap-4">
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

      {/* Categories Section */}
      <h3 className="text-xl font-semibold mt-6">Categories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Staff", value: getCategoryAverage("staffRating") },
          { label: "Facilities", value: getCategoryAverage("facilitiesRating") },
          { label: "Cleanliness", value: getCategoryAverage("cleanlinessRating") },
          { label: "Comfort", value: getCategoryAverage("comfortRating") },
          { label: "Value for Money", value: getCategoryAverage("valueForMoneyRating") },
          { label: "Location", value: getCategoryAverage("locationRating") },
          { label: "Free WiFi", value: getCategoryAverage("freeWifiRating") },
        ].map((category, index) => (
          <div key={index} className="mb-2 p-4 border rounded-md shadow-sm">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">{category.label}</span>
              <span className="text-xs text-gray-600">
                {category.value !== null ? category.value : 'No Ratings Yet'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-blue-600 h-2 rounded-full ${category.value === null ? 'bg-gray-300' : ''}`}
                style={{ width: `${category.value !== null ? Number(category.value) * 10 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Individual Reviews */}
      <h3 className="text-xl font-semibold mt-6">Guest Reviews</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {hasRatings ? (
          reviews.map((review: ReviewType) => {
            const user = getUserInfo(review.userId);
            return (
              <div key={review._id} className="p-4 border rounded-md shadow-sm">
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
                      {Array.from({ length: review.staffRating }).map((_, index) => (
                        <div key={index} className="text-yellow-400">★</div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4">{review.comment}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No Reviews Yet</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
