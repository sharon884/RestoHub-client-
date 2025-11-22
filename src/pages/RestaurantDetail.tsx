// src/pages/RestaurantDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantById } from '../api/restaurant.api';

// FIX: Strict type imports
import type { Restaurant } from '../ types/restaurant.types';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { Button } from '../components/ui/button';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        setError('Could not load restaurant details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{error || "Restaurant not found"}</p>
        <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
           &larr; Back
        </Button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Header Image */}
            <div className="h-64 md:h-80 w-full bg-gray-200 relative">
                <img 
                    src={restaurant.imageUrl || "https://placehold.co/1200x600?text=No+Image"} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Info */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                        <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
                    </div>

                    <div className="flex gap-4">
                         <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                            🍽️ {restaurant.cuisine} Cuisine
                         </div>
                         <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm font-medium">
                            💰 {restaurant.priceRange} Price Range
                         </div>
                         <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md text-sm font-medium">
                            ⭐ {restaurant.averageRating || "New"} Rating
                         </div>
                    </div>
                </div>

                {/* Right Column: Location & Actions */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h3 className="font-semibold text-gray-900 mb-4">Location Details</h3>
                    <p className="text-gray-600 mb-4 text-sm">{restaurant.address}</p>
                    
                    {/* Simple Map Placeholder or Coordinate display */}
                    <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center text-gray-500 text-xs mb-4">
                        Map View <br/>
                        Lat: {restaurant.location.coordinates[1].toFixed(4)} <br/>
                        Lng: {restaurant.location.coordinates[0].toFixed(4)}
                    </div>

                    <Button className="w-full" size="lg">
                        Get Directions
                    </Button>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;