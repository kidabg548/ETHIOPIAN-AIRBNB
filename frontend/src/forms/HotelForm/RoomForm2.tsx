import React, { useState } from "react";
import { roomTypes, roomAmenities, cancellationPolicyRules } from "../../config/hotel-options-config";
import { FaBed, FaDollarSign, FaDoorOpen, FaCog } from "react-icons/fa";

export type RoomFormData = {
  roomType: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  availability: boolean;
  numberOfRooms: number; // Add number of rooms
  cancellationPolicy: string; // Add cancellationPolicy
};

const RoomForm = ({ onRoomDataChange }: { onRoomDataChange: (roomData: RoomFormData) => void }) => {  
  const [roomData, setRoomData] = useState<RoomFormData>({
    roomType: "",
    capacity: 1,
    pricePerNight: 0,
    amenities: [],
    availability: true,
    numberOfRooms: 1, // Set initial number of rooms
    cancellationPolicy: cancellationPolicyRules[0], // Default to the first cancellation policy
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
    onRoomDataChange(roomData); // Call onRoomDataChange on change
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setRoomData((prevData) => {
      const amenities = checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((amenity) => amenity !== value);
      return { ...prevData, amenities };
    });
    onRoomDataChange(roomData); // Call onRoomDataChange on checkbox change
  };

  const handleCancellationPolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { value } = e.target;
  setRoomData((prevData) => {
    const updatedData = { ...prevData, cancellationPolicy: value };
    onRoomDataChange(updatedData); // Call onRoomDataChange with updated roomData
    return updatedData;
  });
};

  const commissionPercentage = 8; // Commission percentage
  const commission = roomData.pricePerNight * (commissionPercentage / 100);
  const earnings = roomData.pricePerNight - commission;

  return (
    <form  className="max-w-xl mx-auto rounded-lg shadow-lg p-6 bg-white space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Add a New Room</h2>

      <div>
        <label htmlFor="roomType" className="flex items-center gap-2 font-bold text-gray-700">
          <FaDoorOpen /> Room Type:
        </label>
        <select
          name="roomType"
          id="roomType"
          value={roomData.roomType}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>Select Room Type</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="numberOfRooms" className="flex items-center gap-2 font-bold text-gray-700">
          Number of Rooms:
        </label>
        <input
          type="number"
          name="numberOfRooms"
          id="numberOfRooms"
          value={roomData.numberOfRooms}
          onChange={handleChange}
          min="1"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label htmlFor="capacity" className="flex items-center gap-2 font-bold text-gray-700">
          <FaBed /> Capacity:
        </label>
        <input
          type="number"
          name="capacity"
          id="capacity"
          value={roomData.capacity}
          onChange={handleChange}
          min="1"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label
          htmlFor="pricePerNight"
          className="flex items-center gap-2 font-bold text-gray-700"
        >
          <FaDollarSign /> Price Per Night:
        </label>
        <input
          type="number"
          name="pricePerNight"
          id="pricePerNight"
          value={roomData.pricePerNight}
          onChange={handleChange}
          min="0"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        {roomData.pricePerNight > 0 && (
          <div className="mt-2">
            <span className="text-gray-500">
              Including taxes, commission and charges
            </span>
            <div className="mt-2">
              <span className="font-bold text-green-500">
                {commissionPercentage}% Hulubeand commission
              </span>
    
            </div>
            <div className="mt-4 font-bold text-red-400">
              US${earnings.toFixed(2)} Your earnings (including taxes)
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 font-bold text-gray-700">
          <FaCog /> Amenities:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {roomAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                value={amenity}
                checked={roomData.amenities.includes(amenity)}
                onChange={handleCheckboxChange}
                id={amenity}
              />
              <label htmlFor={amenity} className="ml-2">{amenity}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="cancellationPolicy" className="flex items-center gap-2 font-bold text-gray-700">
          Cancellation Policy:
        </label>
        <select
          name="cancellationPolicy"
          id="cancellationPolicy"
          value={roomData.cancellationPolicy}
          onChange={handleCancellationPolicyChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {cancellationPolicyRules.map((rule) => (
            <option key={rule} value={rule}>{rule}</option>
          ))}
        </select>
      </div>

      
    </form>
  );
};

export default RoomForm;