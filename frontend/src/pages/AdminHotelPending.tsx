import React, { useEffect, useState } from 'react';
import { fetchPendingHotels } from '../api-client'; // Adjust the import path as needed
import { HotelType } from '../../../backend/shared/types'; // Adjust the import path as needed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


const AdminPendingHotelsPage: React.FC = () => {
  const [pendingHotels, setPendingHotels] = useState<HotelType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPendingHotels = async () => {
      try {
        const hotels = await fetchPendingHotels();
        setPendingHotels(hotels);
      } catch (err) {
        setError('Error fetching pending hotels');
      }
    };

    loadPendingHotels();
  }, []);

  const handleApprove = async (hotelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/approve/${hotelId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error approving hotel');
      }
      // Update the state to remove the approved hotel
      setPendingHotels(pendingHotels.filter((hotel) => hotel._id !== hotelId));
    } catch (err) {
      setError('Error approving hotel');
    }
  };

  const handleReject = async (hotelId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reject/${hotelId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error rejecting hotel');
      }

      // Update the state to remove the rejected hotel
      setPendingHotels(pendingHotels.filter((hotel) => hotel._id !== hotelId));
    } catch (err) {
      setError('Error rejecting hotel');
    }
  };

  return (
    <div>
      <h1>Pending Hotels</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pendingHotels.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingHotels.map((hotel) => (
              <tr key={hotel._id}>
                <td>{hotel.name}</td>
                <td>{hotel.city}</td>
                <td>{hotel.country}</td>
                <td>
                  <button onClick={() => handleApprove(hotel._id)}>Approve</button>
                  <button onClick={() => handleReject(hotel._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending hotels found.</p>
      )}
    </div>
  );
};

export default AdminPendingHotelsPage;
