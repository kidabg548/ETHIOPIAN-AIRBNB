import React, { useState } from "react";
import { roomTypes, roomAmenities } from "../../config/hotel-options-config";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import {
  FaBed,
  FaDollarSign,
  FaDoorOpen,
  FaCog,
  FaPencilAlt,
} from "react-icons/fa";

export type RoomFormData = {
  roomType: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  availability: boolean;
  description?: string;
  imageUrl?: string;
};

const RoomForm = () => {
  const { showToast } = useAppContext(); // Access showToast from context

  const [roomData, setRoomData] = useState<RoomFormData>({
    roomType: "",
    capacity: 1,
    pricePerNight: 0,
    amenities: [],
    availability: true,
    description: "",
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setRoomData((prevData) => {
      const amenities = checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((amenity) => amenity !== value);
      return { ...prevData, amenities };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.addRoom(roomData);
      showToast({ message: "Room added successfully!", type: "SUCCESS" }); // Success message
      setRoomData({
        roomType: "",
        capacity: 1,
        pricePerNight: 0,
        amenities: [],
        availability: true,
        description: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding room:", error);
      showToast({ message: "Failed to add room", type: "ERROR" }); // Error message
    }
  };

  const commissionPercentage = 15; // Commission percentage
  const commission = roomData.pricePerNight * (commissionPercentage / 100);
  const earnings = roomData.pricePerNight - commission;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto rounded-lg shadow-lg p-6 bg-white space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Add a New Room
      </h2>

      <div>
        <label
          htmlFor="roomType"
          className="flex items-center gap-2 font-bold text-gray-700"
        >
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
          <option value="" disabled>
            Select Room Type
          </option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="capacity"
          className="flex items-center gap-2 font-bold text-gray-700"
        >
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
                {commissionPercentage}% Booking.com commission
              </span>
              <ul className="list-disc ml-6 text-gray-600">
                <li>24/7 help in your language</li>
                <li>Save time with automatically confirmed bookings</li>
                <li>We promote your place on Google</li>
              </ul>
            </div>
            <div className="mt-4 font-bold text-gray-700">
              ${earnings.toFixed(2)} Birr Your earnings (including taxes)
              console.log(earnings);
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
              <label htmlFor={amenity} className="ml-2">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="flex items-center gap-2 font-bold text-gray-700"
        >
          <FaPencilAlt /> Description:
        </label>
        <textarea
          name="description"
          id="description"
          value={roomData.description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
          rows={5}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Room
      </button>
    </form>
  );
};

export default RoomForm;
