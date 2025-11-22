// src/components/Map/LocationPicker.tsx (NEW FILE)

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';

// FIX: Fix for default Leaflet marker icons not showing in Webpack/React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

interface LocationPickerProps {
    initialLat: number;
    initialLong: number;
    onLocationChange: (lat: number, long: number) => void;
}

// Helper component to handle map click events
const MapClickDetector: React.FC<{onLocationChange: (lat: number, long: number) => void}> = ({ onLocationChange }) => {
    // This hook automatically gets the map instance and listens for events
    useMapEvents({
        click(e) {
            // Call the handler to update the parent state
            onLocationChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null; 
};


const LocationPicker: React.FC<LocationPickerProps> = ({ initialLat, initialLong, onLocationChange }) => {
    const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression>([initialLat, initialLong]);
    
    // 1. Update local marker position if initial props change (e.g., location loaded globally)
    useEffect(() => {
        setMarkerPosition([initialLat, initialLong]);
    }, [initialLat, initialLong]);

    // 2. Handler for when the marker is dragged
    const handleMarkerDrag = (e: L.LeafletEvent) => {
        const { lat, lng } = e.target.getLatLng();
        setMarkerPosition([lat, lng]);
        onLocationChange(lat, lng);
    };

    // 3. Handler for when the user clicks the map
    const handleMapClick = (lat: number, long: number) => {
        setMarkerPosition([lat, long]);
        onLocationChange(lat, long);
    };


    return (
        <MapContainer 
            center={markerPosition} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '400px', width: '100%' }}
            key={`${initialLat}-${initialLong}`} // Key forces map re-render when initial coords change
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapClickDetector onLocationChange={handleMapClick} /> 

            <Marker 
                position={markerPosition} 
                draggable={true} 
                eventHandlers={{ dragend: handleMarkerDrag }}
            />
        </MapContainer>
    );
};

export default LocationPicker;