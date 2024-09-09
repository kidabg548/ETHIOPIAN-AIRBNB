import { HotelType } from "../../../backend/shared/types";

type Props = {
  hotel: HotelType;
  removeFromSaved: (hotelId: string) => void; // Remove from saved function
};

const DetailCard = ({ hotel, removeFromSaved }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <img
        src={hotel.imageUrls[0]} // Display only the first image
        alt={hotel.name}
        className="rounded-md w-full h-40 object-cover object-center"
      />
      <h3 className="text-lg font-medium mt-2">{hotel.name}</h3>
      <p className="text-gray-600">{hotel.description.slice(0, 100)}...</p> {/* Display first 100 characters of the description */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
          removeFromSaved(hotel._id);
        }}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        Remove
      </button>
    </div>
  );
};

export default DetailCard;
