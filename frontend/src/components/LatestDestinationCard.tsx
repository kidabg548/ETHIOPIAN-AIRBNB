import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HotelType } from "../../../backend/shared/types";
import { saveHotel, unsaveHotel, fetchSavedHotels } from "../api-client";
import { useAppContext } from "../contexts/AppContext";

type Props = {
  hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useAppContext();

  useEffect(() => {
    const checkIfHotelIsSaved = async () => {
      try {
        const savedHotels = await fetchSavedHotels();
        const isHotelSaved = savedHotels.some(savedHotel => {
          return savedHotel.hotelId._id === hotel._id;
        });
        setIsSaved(isHotelSaved);
      } catch (error) {
        console.error("Error fetching saved hotels:", error);
      }
    };
  
    checkIfHotelIsSaved();
  }, [hotel._id]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      if (isSaved) {
        // Unsave the hotel
        await unsaveHotel(hotel._id);
        setIsSaved(false);
        showToast({ message: "Hotel removed from saved list.", type: "SUCCESS" });
      } else {
        // Save the hotel
        await saveHotel(hotel._id);
        setIsSaved(true);
        showToast({ message: "Hotel saved successfully!", type: "SUCCESS" });
      }
    } catch (error) {
      console.error("Error handling save/unsave:", error);
      showToast({ message: "An error occurred while saving or unsaving the hotel.", type: "ERROR" });
    }
  };

  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px] relative">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
          alt={`${hotel.name} image`}
        />

        {/* Heart Icon */}
        <div
          onClick={handleSaveClick}
          className="absolute top-2 left-2 text-white cursor-pointer"
        >
          {isSaved ? (
            <FaHeart className="text-2xl text-red-500" />
          ) : (
            <FaRegHeart className="text-2xl text-white" />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;
