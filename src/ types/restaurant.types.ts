// src/types/restaurant.types.ts

// These mirror the enums defined in your backend restaurant.schema.ts
export type CuisineType = 'Italian' | 'Mexican' | 'Indian' | 'Japanese' | 'Other';
export type PriceRangeType = '£' | '££' | '£££' | '££££';

// Interface for the data collected by the form and sent to the API
export interface RestaurantFormData {
  name: string;
  address: string;
  description: string;
  latitude: number | ''; // Use '' for initial form state, will be converted to number on submit
  longitude: number | '';
  cuisine: CuisineType | '';
  priceRange: PriceRangeType | '';
  imageUrl?: string;
}

// Interface for the successful response from the backend (what we get back after adding a restaurant)
export interface RestaurantResponse {
  _id: string;
  name: string;
  address: string;
  cuisine: CuisineType;
  priceRange: PriceRangeType;
  averageRating: number;
  // ... other fields like createdAt, updatedAt
}

// Define the options for the dropdowns
export const CUISINE_OPTIONS: CuisineType[] = ['Italian', 'Mexican', 'Indian', 'Japanese', 'Other'];
export const PRICE_OPTIONS: PriceRangeType[] = ['£', '££', '£££', '££££'];