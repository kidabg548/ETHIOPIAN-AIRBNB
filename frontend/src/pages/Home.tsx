import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";
import CityCard from "../components/CityCard"; // New City card component
import { HotelType } from "../../../backend/shared/types"; // Adjust import path as needed

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const IPGEOLOCATION_API_KEY = "b59370b2c9d64ad4936327dd4bf3d123"; // Replace with your actual IPGeolocation API key

const Home: React.FC = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [cities, setCities] = useState<{ city: string; hotelCount: number }[]>(
    []
  );

  // Fetch hotels for the latest destinations
  const { data: hotels } = useQuery<HotelType[]>("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  // Filter only approved hotels
  const approvedHotels =
    hotels?.filter((hotel) => hotel.status === "Approved") || [];

  const topRowHotels = approvedHotels.slice(0, 2);
  const bottomRowHotels = approvedHotels.slice(2);

  // Fetch user's country via IPGeolocation API
  useEffect(() => {
    async function fetchUserCountry() {
      try {
        const response = await fetch(
          `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEOLOCATION_API_KEY}`
        );
        const data = await response.json();
        setCountry(data.country_name); // Set the user's country
      } catch (error) {
        console.error("Error fetching geolocation:", error);
      }
    }

    fetchUserCountry();
  }, []);

  // Fetch cities and hotel counts once country is available
  useEffect(() => {
    async function fetchCities() {
      if (country) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/hotels/cities/${country}`
          );
          const citiesData = await response.json();
          setCities(citiesData); // Set the cities data
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    }

    fetchCities();
  }, [country]);

  return (
    <div className="space-y-3">
      {cities.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mt-6 mb-6">Explore {country}</h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {cities.map((cityData) => (
              <CityCard
                key={cityData.city}
                city={cityData.city}
                country={country || ''} // Pass country to CityCard
                hotelCount={cityData.hotelCount}
              />
            ))}
          </div>
        </div>
      )}
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
