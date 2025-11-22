// src/types/restaurant.types.ts

// 1. Basic Types
export type CuisineType = 'Italian' | 'Mexican' | 'Indian' | 'Japanese' | 'Other';
export type PriceRangeType = '£' | '££' | '£££' | '££££';

// 2. Constant Options (Used for Dropdowns)
export const CUISINE_OPTIONS: CuisineType[] = ['Italian', 'Mexican', 'Indian', 'Japanese', 'Other'];
export const PRICE_OPTIONS: PriceRangeType[] = ['£', '££', '£££', '££££'];

// 3. Interface for the Restaurant Object (From Database)
export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  description: string;
  cuisine: CuisineType;
  priceRange: PriceRangeType;
  imageUrl?: string;
  averageRating: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt?: string;
}

// 4. Interface for Filters (Used in Explore Page)
export interface RestaurantFilters {
  page: number;
  limit: number;
  search?: string;
  cuisine?: string;
  priceRange?: string;
}

// 5. Interface for API Response (Pagination)
export interface PaginatedResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 6. Interface for Form Data (Used in Add Restaurant Page)
export interface RestaurantFormData {
  name: string;
  address: string;
  description: string;
  latitude: number | ''; 
  longitude: number | '';
  cuisine: CuisineType | '';
  priceRange: PriceRangeType | '';
  imageFile?: File | null; 
  imageUrl: string; 
}