import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import {
  BsBuilding,
  BsList,
  BsMap,
  BsArrowLeftRight,
  BsStarFill,
  BsXCircle,
} from "react-icons/bs";
import { BiCheckCircle, BiHotel, BiMoney, BiStar, BiXCircle } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { useQuery } from "react-query";
import { ReactNode, useState, useEffect } from "react";
import { HotelType } from "../../../backend/shared/types";
import dayjs from "dayjs";

interface CardProps {
  title: string;
  icon: ReactNode;
  count: number;
  linkTo?: string; // Optional link
}

const MyHotels = () => {
  const [reviewCounts, setReviewCounts] = useState<{
    [hotelId: string]: number;
  }>({});
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [arrivalsCount, setArrivalsCount] = useState(0);
  const [departuresCount, setDeparturesCount] = useState(0);

  // Fetch all hotels
  const {
    data: hotelData,
    isLoading,
    isError,
  } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

  // Fetch reviews and review counts
  const fetchHotelData = async () => {
    if (!hotelData) return;

    const counts: { [key: string]: number } = {};
    const reviews: any[] = [];

    for (const hotel of hotelData) {
      try {
        const count = await apiClient.fetchReviewCount(hotel._id);
        counts[hotel._id] = count;

        const hotelReviews = await apiClient.fetchReviewsByHotelId(hotel._id);
        reviews.push(...hotelReviews);
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    }

    setReviewCounts(counts);
    setAllReviews(reviews);
  };

  // Fetch booking count
  // Fetch reservation count based on the logged-in user's owned hotels
  useEffect(() => {
    const fetchCount = async () => {
      const count = await apiClient.fetchBookingCount();
      if (count !== null) {
        setBookingCount(count);
      } else {
        // Handle error (e.g., display an error message)
        console.error("Error fetching booking count");
      }
    };

    fetchCount(); // Call the function to fetch the initial count
  }, []);

  // Fetch arrivals count (updated daily)
  useEffect(() => {
    const updateArrivalsCount = async () => {
      const today = dayjs();
      const arrivals = await apiClient.fetchBookingsByCheckinDate(today);
      setArrivalsCount(arrivals.length);
    };

    updateArrivalsCount();
    const intervalId = setInterval(updateArrivalsCount, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch departures count (updated daily)
  useEffect(() => {
    const updateDeparturesCount = async () => {
      const today = dayjs();
      const departures = await apiClient.fetchBookingsByCheckoutDate(today);
      setDeparturesCount(departures.length);
    };

    updateDeparturesCount();
    const intervalId = setInterval(updateDeparturesCount, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useQuery("fetchHotelData", fetchHotelData, {
    enabled: !!hotelData,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError || !hotelData || hotelData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No Hotels found
      </div>
    );
  }

  const ReviewCard = ({ hotelId }: { hotelId: string }) => {
    const reviewCount = reviewCounts[hotelId] || 0;

    return (
      <Link
        to={`/reviews/${hotelId}`}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-2xl"
      >
        <div className="flex items-center">
          <BsStarFill />
          <h3 className="ml-2 font-medium">Reviews</h3>
        </div>
        <span className="text-3xl font-bold">{reviewCount}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-10 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">My Hotels</h1>
            <Link
              to="/add-hotel"
              className="flex items-center bg-white text-blue-600 text-xl font-bold p-2 rounded-lg hover:bg-gray-100"
            >
              <FiPlus className="mr-2" />
              Add Hotel
            </Link>
          </div>
        </div>
      </header>

      {/* **Happening Today Section** */}
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-center mb-4">Happening Today</h2>
        {/* Arrivals and Departures Cards (Top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Link
            to="/arrivals"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-2xl"
          >
            <div className="flex items-center">
              <BsArrowLeftRight />
              <h3 className="ml-2 font-medium">Arrivals</h3>
            </div>
            <span className="text-3xl font-bold">{arrivalsCount}</span>
          </Link>
          <Link
            to="/departures"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-2xl"
          >
            <div className="flex items-center">
              <BsArrowLeftRight />
              <h3 className="ml-2 font-medium">Departures</h3>
            </div>
            <span className="text-3xl font-bold">{departuresCount}</span>
          </Link>
        </div>

        {/* **Other Cards Section** */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/reservations"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-2xl"
          >
            <div className="flex items-center">
              <BsList />
              <h3 className="ml-2 font-medium">Reservations</h3>
            </div>
            <span className="text-3xl font-bold">{bookingCount}</span>
          </Link>
          <Card
            title="Cancellations"
            icon={<BsXCircle />}
            count={0}
            linkTo="/cancellations"
          />
          <Card
            title="Reviews"
            icon={<BsStarFill />}
            count={allReviews.length}
            linkTo="/reviewss"
          />
        </div>
      </div>

      {/* **Hotel List Section** */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotelData.map((hotel: HotelType) => (
          <div
            key={hotel._id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">{hotel.name}</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <BsMap className="mr-2 text-gray-600" />
                <span className="text-gray-700">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
              <div className="flex items-center">
                <BsBuilding className="mr-2 text-gray-600" />
                <span className="text-gray-700">{hotel.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <BiMoney className="mr-2 text-gray-600" />
                {/* <span className="text-gray-700">{hotel.pricePerNight} Birr per night</span> */}
              </div>
              <div className="flex items-center">
                <BiStar className="mr-2 text-gray-600" />
                <span className="text-gray-700">
                  {hotel.starRating} Star Rating
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {hotel.status === "Approved" ? (
                  <BiCheckCircle className="mr-2 text-2xl text-green-500" /> // Green check icon for approved
                ) : hotel.status === "Rejected" ? (
                  <BiXCircle className="mr-2 text-2xl text-red-500" /> // Red X icon for rejected
                ) : (
                  <BiHotel className="mr-2 text-gray-600" /> // Default hotel icon for pending or other status
                )}
                <span className="text-2xl">{hotel.status}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="bg-blue-600 text-white text-xl font-bold p-2 rounded-lg hover:bg-blue-500"
              >
                View Details
              </Link>
            </div>
            {/* Review Card for each hotel */}
            <div className="mt-4">
              <ReviewCard hotelId={hotel._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, icon, count }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-between hover:shadow-2xl cursor-default">
      <div className="flex items-center">
        {icon}
        <h3 className="ml-2 font-medium">{title}</h3>
      </div>
      <span className="text-3xl font-bold">{count}</span>
    </div>
  );
};
export default MyHotels;
