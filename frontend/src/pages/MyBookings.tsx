import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { HotelType } from "../../../backend/shared/types"; 

const MyBookings = () => {
  const { data: hotels } = useQuery<HotelType[]>(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <span className="text-xl">No bookings found</span>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
        My Bookings
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Hotel Image */}
            <div className="relative h-60">
              <img
                src={hotel.imageUrls[0]}
                className="w-full h-full object-cover object-center"
                alt={`${hotel.name} image`}
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-4 w-full">
                <h2 className="text-xl font-bold text-white truncate">
                  {hotel.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {hotel.city}, {hotel.country}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6 space-y-4">
              {hotel.bookings.map((booking) => (
                <div key={booking._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Dates</div>
                  <div className="text-gray-800">
                    {new Date(booking.checkIn).toDateString()} - {new Date(booking.checkOut).toDateString()}
                  </div>

                  <div className="text-sm text-gray-500 mt-2">Guests</div>
                  <div className="text-gray-800">
                    {booking.adultCount} adults, {booking.childCount} children
                  </div>

                  <div className="text-sm text-gray-500 mt-2">Ticket Number</div>
                  <div className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
                    {booking.ticketNumber}
                  </div>

                  {/* Write Review Button */}
                  {new Date() > new Date(booking.checkOut) && (
                    <Link to={`/hotel/${hotel._id}/${booking._id}/review`}>
                      <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md">
                        Write a Review
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
