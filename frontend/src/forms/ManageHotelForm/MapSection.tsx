// MapSection.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import cursorIcon from 'leaflet/dist/images/marker-icon.png'; // Use your custom cursor icon
import axios from 'axios'; // Import axios for reverse geocoding

// Default icon for leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapSectionProps = {
  initialLocation: { latitude: number; longitude: number };
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
};

const MapSection: React.FC<MapSectionProps> = ({ onLocationSelect, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [cursorPosition, setCursorPosition] = useState(initialLocation);
  const [pinnedLocation, setPinnedLocation] = useState(initialLocation);
  const [locationInfo, setLocationInfo] = useState({ city: '', country: '' }); // State for city and country

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newPosition = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };
        setMarkerPosition(newPosition);
        setPinnedLocation(newPosition); // Set the pinned location

        onLocationSelect(newPosition);

        // Reverse geocode to get city and country
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPosition.latitude}&lon=${newPosition.longitude}`)
          .then(response => {
            setLocationInfo({
              city: response.data.address.city || 
                response.data.address.town || 
                response.data.address.village || 
                response.data.address.hamlet ||
                response.data.address.suburb || 
                response.data.address.neighbourhood || 
                response.data.address.road || // In case it's a very small place
                '', // Default to empty string if nothing is found
              country: response.data.address.country || ''
            });
          })
          .catch(error => {
            console.error('Error fetching location info:', error);
          });
      },
      mousemove(e) {
        const newCursorPosition = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };
        setCursorPosition(newCursorPosition);
      }
    });
    return null;
  };

  return (
    <MapContainer
      center={[markerPosition.latitude, markerPosition.longitude]}
      zoom={3}
      style={{ height: "400px", width: "100%" }}
      className="cursor-none" // Hide the default cursor
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pinnedLocation && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {locationInfo.city ? <p>City: {locationInfo.city}</p> : null}
          {locationInfo.country ? <p>Country: {locationInfo.country}</p> : null}
          {/* Add your marker for pinnedLocation here */}
          <Marker 
            position={[pinnedLocation.latitude, pinnedLocation.longitude]}
            icon={L.icon({ iconUrl: cursorIcon, iconSize: [25, 41], iconAnchor: [12, 41] })}
          />
        </div>
      )}
      <Marker position={[markerPosition.latitude, markerPosition.longitude]} />
      {/* Custom cursor marker */}
      <Marker
        position={[cursorPosition.latitude, cursorPosition.longitude]}
        icon={L.icon({ iconUrl: cursorIcon, iconSize: [25, 41], iconAnchor: [12, 41] })}
      />
      <MapEvents />
    </MapContainer>
  );
};

export default MapSection;