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
  ticketNumber: string;
  // ... other booking properties
}
const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<(BookingType & { hotelName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Track search state
  const [sortBy, setSortBy] = useState<"checkIn" | "checkOut" | null>(null); // State for sorting

  const fetchReservation = async () => {
    try {
      let bookings: BookingType[] = await apiClient.fetchBookingsByOwner(); // Explicit typing

      if (searchTerm) {
        bookings = bookings.filter(
          (booking) => {
            // Check if booking.ticketNumber is defined before using toLowerCase()
            if (booking.ticketNumber) {
              return booking.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
              return false; // Or handle the case where ticketNumber is undefined
            }
          }
        );
      }
      // Sort based on sortBy state
      if (sortBy === 'checkIn') {
        bookings.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
      } else if (sortBy === 'checkOut') {
        bookings.sort((a, b) => new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime());
      }
      const bookingsWithHotelNames = await Promise.all(
        bookings.map(async (booking) => {
          const hotelName = await apiClient.fetchHotelName(booking.hotelId);
          return { ...booking, hotelName };
        })
      );

      setReservations(bookingsWithHotelNames);
    } catch (error: any) {
      setError(error.message || "Error fetching reservations.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchReservation();
  }, [searchTerm, sortBy]); // Fetch when search term or sortBy changes
  const handleSortChange = (newSortBy: "checkIn" | "checkOut" | null) => {
    setSortBy(newSortBy);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearching(e.target.value !== ''); // Update search state
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-700 text-center">Your Reservations</h2>

      <div className={`mb-4 ${isSearching ? 'w-full' : 'w-1/3'}`}> {/* Responsive width */}
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Search by Ticket Number"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex justify-end mb-4"> {/* Add sort buttons */}
        <button 
          className={`px-4 py-2 rounded-md border ${sortBy === 'checkIn' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSortChange('checkIn')}
        >
          Sort by Check-in Date
        </button>
        <button 
          className={`px-4 py-2 rounded-md border ml-2 ${sortBy === 'checkOut' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSortChange('checkOut')}
        >
          Sort by Check-out Date
        </button>
      </div>
      {reservations.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No reservations found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white uppercase text-sm leading-normal">
              
              <th className="py-3 px-6 text-left">Ticket Number</th>
              <th className="py-3 px-6 text-left">Hotel Name</th>
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Check-in Date</th>
                <th className="py-3 px-6 text-left">Check-out Date</th>
                
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {reservations.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-3 px-6 text-left">{booking.ticketNumber}</td>
                  <td className="py-3 px-6 text-left">{booking.hotelName}</td>
                  <td className="py-3 px-6 text-left">{booking.firstName}</td>
                  <td className="py-3 px-6 text-left">{booking.lastName}</td>
                  <td className="py-3 px-6 text-left">{booking.email}</td>
                  <td className="py-3 px-6 text-left">{dayjs(booking.checkIn).format('YYYY-MM-DD')}</td>
                  <td className="py-3 px-6 text-left">{dayjs(booking.checkOut).format('YYYY-MM-DD')}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reservations;