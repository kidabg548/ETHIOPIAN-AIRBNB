import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../../forms/GuestInfoForm2/GuestInfoForm";
import { useState, useMemo, useRef } from "react";
import ReviewPage from "../ReviewPage";
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cursorIcon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import ReviewForDetailPage from "../ReviewForDetailPage" 


const Detail2 = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const { data: rooms } = useQuery(
    "fetchRoomsByHotelId",
    () => apiClient.fetchRoomsByHotelId(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>(
    {}
  );
  const [showOptions, setShowOptions] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [roomDropdownId, setRoomDropdownId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const toggleOptions = (id: string) => {
    setRoomDropdownId(id === roomDropdownId ? null : id);
    setShowOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchRoomDetails = (roomId: string) => {
    setSelectedRoomId(roomId);
    refetch();
  };

  const { data: room, refetch } = useQuery(
    ["fetchRoomById", selectedRoomId],
    () => apiClient.fetchRoomById(selectedRoomId || ""),
    {
      enabled: !!selectedRoomId,
    }
  );

  const calculateTotalPrice = (roomId: string, pricePerNight: number) => {
    const selectedCount = selectedRooms[roomId] || 0;
    return selectedCount * pricePerNight;
  };

  // Function to get the room type name from the room ID
  const getRoomTypeName = (roomId: string) => {
    if (!rooms) return "Unknown Room Type";
    const room = rooms.find((r) => r._id === roomId);
    return room?.roomType || "Unknown Room Type";
  };

  // Memoized calculation of total selected rooms and total price
  const { totalSelectedRooms, totalPrice, selectedRoomSummary } =
    useMemo(() => {
      const totalRooms = Object.values(selectedRooms).reduce(
        (acc, count) => acc + count,
        0
      );
      const totalPrice =
        rooms?.reduce((acc, room) => {
          const selectedCount = selectedRooms[room._id] || 0;
          return acc + selectedCount * room.pricePerNight;
        }, 0) || 0;

      // Calculate the selected room summary
      const selectedRoomSummary = Object.entries(selectedRooms)
        .filter(([_, count]) => count > 0) // Use underscore instead of roomId
        .map(([roomId, count]) => `${count} ${getRoomTypeName(roomId)}`);

      return {
        totalSelectedRooms: totalRooms,
        totalPrice,
        selectedRoomSummary,
      };
    }, [selectedRooms, rooms]);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      const newIndex =
        (prevIndex - 1 + (hotel?.imageUrls.length || 0)) %
        (hotel?.imageUrls.length || 1);
      return newIndex;
    });
  };

  const handleNext = () => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      const newIndex = (prevIndex + 1) % (hotel?.imageUrls.length || 1);
      return newIndex;
    });
  };

  

  if (!hotel || !rooms) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      {/* Create a flex container to hold both the images and the map */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Gallery with 2/3 Width and Image Sizing */}
        <div className="relative rounded-lg overflow-hidden shadow-md lg:w-2/3">
          {/* Use flexbox to fill the container */}
          <div className="flex flex-col gap-2">
            {/* First row - Large Image */}
            {hotel.imageUrls.length > 0 && (
              <div className="h-[400px] flex">
                <img
                  src={hotel.imageUrls[0]}
                  alt={hotel.name}
                  className="rounded-md w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Second row - Small Images */}
            <div className="grid grid-cols-5 gap-2">
              {hotel.imageUrls.slice(1, 6).map((image, index) => (
                <div
                  key={index}
                  className="h-[100px] flex-1 cursor-pointer"
                  onClick={() => handleImageClick(index + 1)}
                >
                  <img
                    src={image}
                    alt={hotel.name}
                    className="rounded-md w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Third row - Medium Images */}
            <div className="grid grid-cols-2 gap-2">
              {hotel.imageUrls.slice(6, 8).map((image, index) => (
                <div
                  key={index}
                  className="h-[150px] flex-1 cursor-pointer"
                  onClick={() => handleImageClick(index + 6)}
                >
                  <img
                    src={image}
                    alt={hotel.name}
                    className="rounded-md w-full h-full object-cover object-center"
                  />
                </div>
              ))}

              {/* Display the "View More" text on the last image if needed */}
              {hotel.imageUrls.length > 8 && (
                <div
                  key="more-photos"
                  className="h-[150px] flex-1 cursor-pointer"
                  onClick={() => handleImageClick(8)}
                >
                  <img
                    src={hotel.imageUrls[8]}
                    alt={hotel.name}
                    className="rounded-md w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-md">
                    {`+ ${hotel.imageUrls.length - 8} Photos`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal for Image Slideshow */}
          {showModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white rounded-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  ref={imageRef}
                  src={hotel.imageUrls[selectedImageIndex || 0]}
                  alt={hotel.name}
                  className="rounded-md w-full h-[400px] object-cover object-center"
                />

                {/* Navigation Arrows */}
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-gray-700"
                  onClick={handlePrevious}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md hover:bg-gray-700"
                  onClick={handleNext}
                >
                  <FaArrowRight />
                </button>

                <button
                  className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="flex flex-col lg:w-1/3 h-full space-y-4">
          {/* Map */}
          <div className="h-48 lg:h-[400px] rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={[hotel.location.latitude, hotel.location.longitude]}
              zoom={14}
              style={{ height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[hotel.location.latitude, hotel.location.longitude]}
                icon={L.icon({
                  iconUrl: cursorIcon,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              />
            </MapContainer>
          </div>

          {/* ReviewForDetailPage */}
          <div className="h-48 lg:h-[400px] rounded-lg overflow-hidden shadow-md">
            <ReviewForDetailPage  />
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility, index) => (
          <div key={index} className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            hotelId={hotel._id}
            selectedRooms={selectedRooms}
            rooms={rooms}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-6">Available Rooms</h2>
        <table className="min-w-full table-auto relative">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3">Room Type</th>
              <th className="px-6 py-3">Number of Guests</th>
              <th className="px-6 py-3">Price Per Night</th>
              <th className="px-6 py-3">Select Rooms</th>
              <th className="px-6 py-3">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rooms.map((room) => {
              const totalPrice = calculateTotalPrice(
                room._id,
                room.pricePerNight
              );
              return (
                <tr key={room._id}>
                  <td
                    className="px-6 py-4 border-b border-slate-200"
                    onClick={() => fetchRoomDetails(room._id)}
                  >
                    {room.roomType}
                    {room.numberOfRooms === 0 ? (
                    <div className="text-red-500 flex items-center gap-2 mt-2">
                      <FaExclamationTriangle />
                      No available rooms
                    </div>
                  ) : room.numberOfRooms < 4 ? (
                    <div className="text-red-500 flex items-center gap-2 mt-2">
                      <FaExclamationTriangle />
                      {room.numberOfRooms} available rooms of this type on our site
                    </div>
                  ) : null}
                  </td>
                  <td className="px-6 py-4 border-b border-slate-200">
                    {room.capacity}
                  </td>
                  <td className="px-6 py-4 border-b border-slate-200">
                    ${room.pricePerNight}
                  </td>
                  <td className="px-6 py-4 border-b border-slate-200 relative">
                    <div
                      className="select-room-container"
                      onClick={() => toggleOptions(room._id)}
                    >
                      <span className="border rounded px-2 py-1">
                        {selectedRooms[room._id] || 0}
                      </span>
                    </div>
                    {showOptions[room._id] && (
                      <ul
                        className="select-room-options absolute bg-white border rounded shadow-md mt-2 min-w-[150px] z-10"
                        style={{ display: "block" }}
                      >
                        {Array.from({ length: room.numberOfRooms + 1 }).map(
                          (_, index) => (
                            <li
                              key={index}
                              value={index}
                              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedRooms((prev) => ({
                                  ...prev,
                                  [room._id]: index,
                                }));
                                setShowOptions((prev) => ({
                                  ...prev,
                                  [room._id]: false,
                                }));
                              }}
                            >
                              {`${index} room(s) - $${
                                index * room.pricePerNight
                              }`}
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-slate-200">
                    ${totalPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Display selected room summary before the total price */}
        {selectedRoomSummary.length > 0 && (
          <div className="mt-2 text-right font-bold text-lg">
            {selectedRoomSummary.join(", ")}
          </div>
        )}

        {/* Display total selected rooms and total price */}
        <div className="mt-4 text-right font-bold text-lg">
          {totalSelectedRooms} room(s) selected - Total: {totalPrice} Birr
        </div>

        {room && (
          <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">Room Details</h3>
            <p>Room Type: {room.roomType}</p>
            <p>Capacity: {room.capacity} Guests</p>
            <p>Price Per Night: ${room.pricePerNight}</p>
            <p>Amenities: {room.amenities}</p>


            <ul>
              {room.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ReviewPage />
    </div>
  );
};

export default Detail2;
