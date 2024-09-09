import { HotelType } from "../../../backend/shared/types";

type Props = {
  checkIn: Date;  // This will come from the SearchContext
  checkOut: Date; // This will come from the SearchContext
  adultCount: number; // This will come from the SearchContext
  childCount: number; // This will come from the SearchContext
  numberOfNights: number; // This will be passed from the navigation state
  hotel: HotelType; // This will be fetched from the API in the Booking component
  selectedRooms: { [key: string]: number }; // This will be passed from the navigation state
  rooms: any[]; // This will be passed from the navigation state
};

const BookingDetailsSummary2 = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
  selectedRooms,
  rooms,
}: Props) => {
  const getRoomTypeName = (roomId: string) => {
    if (!rooms) return "Unknown Room Type";
    const room = rooms.find((r) => r._id === roomId);
    return room?.roomType || "Unknown Room Type";
  };

  const selectedRoomSummary = Object.entries(selectedRooms)
    .filter(([_, count]) => count > 0)
    .map(([roomId, count]) => `${count} ${getRoomTypeName(roomId)}`);

  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold"> {checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold"> {checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Total length of stay:
        <div className="font-bold">{numberOfNights} nights</div>
      </div>

      <div>
        Guests
        <div className="font-bold">
          {adultCount} adults & {childCount} children
        </div>
      </div>

      {/* Room Details */}
      <div className="border-t border-b py-2">
        Rooms:
        {selectedRoomSummary.length > 0 ? (
          <div className="font-bold">{selectedRoomSummary.join(", ")}</div>
        ) : (
          <div className="font-bold">No rooms selected yet</div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsSummary2;
