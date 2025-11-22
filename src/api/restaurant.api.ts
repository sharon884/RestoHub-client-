// src/api/restaurant.api.ts

import axios from 'axios'; 
import type { 
    RestaurantFormData, 
    Restaurant, // <--- WE USE THIS NOW
    PaginatedResponse, 
    RestaurantFilters 
} from '../ types/restaurant.types'; // FIX: Removed space after 'from'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/restaurants';

// Interface for API error structure
interface ApiErrorResponse {
    message: string;
    errors?: any; 
}

/**
 * Submits new restaurant data to the backend API.
 */
// FIX: Return type is now Promise<Restaurant>
export const addRestaurant = async (data: RestaurantFormData): Promise<Restaurant> => {
    
    const payload = {
        ...data,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
    };

    try {
        // FIX: Typed the response to expect 'restaurant: Restaurant'
        const response = await axios.post<
            { message: string; restaurant: Restaurant }
        >(
            API_BASE_URL, 
            payload 
        );
        
        return response.data.restaurant;
        
    } catch (error) {
        let errorMessage = 'A network error occurred or the server is unreachable.';

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorData: ApiErrorResponse = error.response.data;
                errorMessage = errorData.message || `Request failed with status ${error.response.status}.`;
            } else if (error.request) {
                errorMessage = 'No response received from the server.';
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

/**
 * Fetches restaurants with filters and pagination.
 */
export const getRestaurants = async (filters: RestaurantFilters): Promise<PaginatedResponse> => {
    try {
        const params: Record<string, any> = {
            page: filters.page,
            limit: filters.limit,
        };

        // Only add filters if they have values
        if (filters.search) params.search = filters.search;
        if (filters.cuisine) params.cuisine = filters.cuisine;
        if (filters.priceRange) params.priceRange = filters.priceRange;

        const response = await axios.get<PaginatedResponse>(API_BASE_URL, { params });
        
        return response.data;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw new Error('Failed to fetch restaurants');
    }
};