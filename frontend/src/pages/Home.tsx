import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";
import { HotelType } from "../../../backend/shared/types"; // Adjust import path as needed

const Home: React.FC = () => {
  const { data: hotels } = useQuery<HotelType[]>("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  // Filter only approved hotels
  const approvedHotels = hotels?.filter(hotel => hotel.status === "Approved") || [];

  const topRowHotels = approvedHotels.slice(0, 2);
  const bottomRowHotels = approvedHotels.slice(2);

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
