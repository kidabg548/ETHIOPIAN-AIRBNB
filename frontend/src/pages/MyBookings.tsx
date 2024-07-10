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
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="flex flex-col items-center gap-6"> {/* Centered content */}
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="grid grid-cols-1 lg:grid-cols-[200px_1fr] border border-slate-300 rounded-xl p-6 gap-6 w-full max-w-7xl relative transition-transform duration-300 hover:scale-105 hover:shadow-lg" 
            // Limited the width and kept curved corners
          >
            {/* Hotel Image */}
            <div className="w-[400px] h-[300px] overflow-hidden rounded-lg">
              <img
                src={hotel.imageUrls[0]}
                className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-110"
                alt={`${hotel.name} image`}
              />
            </div>

            {/* Scrollable Booking Details */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[250px]">
              <div className="text-xl font-bold"> {/* Adjusted text size */}
                {hotel.name}
                <div className="text-xs font-normal">{hotel.city}, {hotel.country}</div>
              </div>

              {/* Scrollable Bookings */}
              {hotel.bookings.map((booking) => (
                <div key={booking._id} className="space-y-1">
                  <div>
                    <span className="font-bold mr-2">Dates: </span>
                    <span>{new Date(booking.checkIn).toDateString()} - {new Date(booking.checkOut).toDateString()}</span>
                  </div>
                  <div>
                    <span className="font-bold mr-2">Guests:</span>
                    <span>{booking.adultCount} adults, {booking.childCount} children</span>
                  </div>

                  {/* Ticket Number */}
                  <div>
                    <span className="ml-48 font-bold mr-2">Ticket Number:</span>
                    <span>{booking.ticketNumber}</span>
                  </div>

                  {/* Write Review Button */}
                  {new Date() > new Date(booking.checkOut) && (
                    <Link to={`/hotel/${hotel._id}/${booking._id}/review`}>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg absolute bottom-4 right-4">
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
