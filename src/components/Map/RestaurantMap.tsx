// src/components/Map/RestaurantMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Restaurant } from '../../ types/restaurant.types';

// IMPORTANT: Fix for Leaflet marker icons not showing up correctly.
// We use CDN links for simplicity, similar to your LocationPicker's intent.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  restaurant: Restaurant;
}

// Helper component to recenter the map if the restaurant prop changes
const ChangeView: React.FC<{ center: L.LatLngExpression, zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const RestaurantMap: React.FC<Props> = ({ restaurant }) => {
  // MongoDB GeoJSON stores coordinates as [longitude, latitude].
  // Leaflet requires the standard [latitude, longitude].
  const [lng, lat] = restaurant.location.coordinates;
  const position: L.LatLngExpression = [lat, lng];
  const ZOOM_LEVEL = 15;

  return (
    // MapContainer must have a defined height (set in parent via Tailwind)
    <MapContainer 
      center={position} 
      zoom={ZOOM_LEVEL} 
      scrollWheelZoom={false} // Disable zoom for a static view
      className="h-full w-full rounded-md z-0" 
      key={restaurant._id} // Key forces map reset if user views a different restaurant
    >
      {/* Ensures the map centers correctly when data loads */}
      <ChangeView center={position} zoom={ZOOM_LEVEL} />
      
      {/* Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker */}
      <Marker position={position} icon={defaultIcon}>
        <Popup>{restaurant.name}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RestaurantMap;