// src/components/Card/RestaurantCard.tsx
import React from 'react';

// FIX 1: Added 'type' keyword
// FIX 2: Removed the space in the path ('../../ types' -> '../../types')
import type { Restaurant } from '../../ types/restaurant.types'; 
import { useNavigate } from 'react-router-dom';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card'; 
import { Button } from '../ui/button'; 

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ restaurant }) => {

    const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-200">
        <img 
          src={restaurant.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
          ⭐ {restaurant.averageRating || 0}
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl mb-1">{restaurant.name}</CardTitle>
                <CardDescription>{restaurant.address}</CardDescription>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {restaurant.priceRange}
            </span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm line-clamp-2">
          {restaurant.description}
        </p>
        <div className="mt-4">
             <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                {restaurant.cuisine}
             </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="outline" onClick={() => navigate(`/restaurant/${restaurant._id}`)} >
            View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;