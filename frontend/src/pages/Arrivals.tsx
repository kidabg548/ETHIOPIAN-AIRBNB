import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import dayjs from 'dayjs';

interface BookingType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  hotelId: string;
  bookingId: string;
  // ... other booking properties
}

const Arrivals: React.FC = () => {
  const [arrivals, setArrivals] = useState<(BookingType & { hotelName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArrivals = async () => {
    try {
      const today = dayjs();
      const bookings = await apiClient.fetchBookingsByCheckinDate(today);
      const bookingsWithHotelNames = await Promise.all(
        bookings.map(async (booking: BookingType) => {
          const hotelName = await apiClient.fetchHotelName(booking.hotelId);
          return { ...booking, hotelName };
        })
      );
      setArrivals(bookingsWithHotelNames);
    } catch (error: any) {
      setError(error.message || "Error fetching arrivals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-700 text-center">Arrivals Today</h2>

      {arrivals.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No arrivals available today.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Check-in Date</th>
                <th className="py-3 px-6 text-left">Check-out Date</th>
                <th className="py-3 px-6 text-left">Hotel Name</th>
                <th className="py-3 px-6 text-left">Booking ID</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {arrivals.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-3 px-6 text-left">{booking.firstName}</td>
                  <td className="py-3 px-6 text-left">{booking.lastName}</td>
                  <td className="py-3 px-6 text-left">{booking.email}</td>
                  <td className="py-3 px-6 text-left">{dayjs(booking.checkIn).format('YYYY-MM-DD')}</td>
                  <td className="py-3 px-6 text-left">{dayjs(booking.checkOut).format('YYYY-MM-DD')}</td>
                  <td className="py-3 px-6 text-left">{booking.hotelName}</td>
                  <td className="py-3 px-6 text-left">{booking._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Arrivals;
