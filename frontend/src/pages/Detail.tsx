// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

// const Detail = () => {
//   const { hotelId } = useParams();

//   const { data: hotel } = useQuery(
//     "fetchHotelById",
//     () => apiClient.fetchHotelById(hotelId || ""),
//     {
//       enabled: !!hotelId,
//     }
//   );

//   const { data: rooms } = useQuery(
//     "fetchRoomsByHotelId",
//     () => apiClient.fetchRoomsByHotelId(hotelId || ""),
//     {
//       enabled: !!hotelId,
//     }
//   );

//   if (!hotel || !rooms) {
//     return <></>;
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <span className="flex">
//           {Array.from({ length: hotel.starRating }).map((_, index) => (
//             <AiFillStar key={index} className="fill-yellow-400" />
//           ))}
//         </span>
//         <h1 className="text-3xl font-bold">{hotel.name}</h1>
//       </div>

//       {/* Image Gallery Card */}
//       <div className="relative rounded-lg overflow-hidden shadow-md">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//           {/* First Image (Larger) */}
//           {hotel.imageUrls.length > 0 && (
//             <div className="col-span-1 md:col-span-2 lg:col-span-2 h-[300px]">
//               <img
//                 src={hotel.imageUrls[0]}
//                 alt={hotel.name}
//                 className="rounded-md w-full h-full object-cover object-center"
//               />
//             </div>
//           )}

//           {/* Remaining Images (Smaller) */}
//           {hotel.imageUrls.slice(1, 7).map((image, index) => (
//             <div key={index} className="h-[150px]">
//               <img
//                 src={image}
//                 alt={hotel.name}
//                 className="rounded-md w-full h-full object-cover object-center"
//               />
//             </div>
//           ))}
//           {hotel.imageUrls.length > 7 && (
//             <div className="h-[150px] flex items-center justify-center text-white bg-gray-800 rounded-md">
//               {`+ ${hotel.imageUrls.length - 7} Photos`}
//             </div>
//           )}
//         </div>
//         {/* Add a 'View More' button if there are more images */}
//         {hotel.imageUrls.length > 7 && (
//           <button className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//             View More
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
//         {hotel.facilities.map((facility, index) => (
//           <div key={index} className="border border-slate-300 rounded-sm p-3">
//             {facility}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
//         <div className="whitespace-pre-line">{hotel.description}</div>
//         <div className="h-fit">
//           <GuestInfoForm
//             pricePerNight={rooms.pricePerNight}
//             hotelId={hotel._id}
//           />
//         </div>
//       </div>

//       {/* Rooms Section */}
//       <div>
//         <h2 className="text-2xl font-semibold mt-6">Available Rooms</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
//           {rooms.map((room) => (
//             <div
//               key={room._id}
//               className="border border-slate-300 rounded-lg p-4 flex flex-col space-y-3"
//             >
//               <h3 className="text-xl font-medium">{room.roomType}</h3>
//               <div className="text-gray-600">Price per night: ${room.pricePerNight}</div>
//               <div className="text-gray-600">Number of rooms: {room.numberOfRooms.toString()}</div>
//               {room.imageUrl && (
//                 <img
//                   src={room.imageUrl}
//                   alt={room.roomType}
//                   className="rounded-md w-full h-[150px] object-cover object-center"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Detail;
