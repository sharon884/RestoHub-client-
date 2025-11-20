

// Use 'import type' for type-only imports
import type { RestaurantFormData, RestaurantResponse } from '../ types/restaurant.types';

const API_BASE_URL =  import.meta.env.VITE_API_URL;

interface ApiErrorResponse {
    message: string;
    errors?: any; 
}

/**
 * Submits new restaurant data to the backend API.
 */
export const addRestaurant = async (data: RestaurantFormData): Promise<RestaurantResponse> => {
    
    const payload = {
        ...data,
        // Ensure conversion to Number for Zod validation on the backend
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        // --- THIS AREA WAS LIKELY LINE 17 WHERE THE CONFLICT OCCURRED ---
        // By using the 'payload' object directly in the fetch request, 
        // we avoid calling any external functions that expect a single 'location' field.
        
        const responseBody = await response.json();

        if (!response.ok) {
            const errorData: ApiErrorResponse = responseBody;
            throw new Error(errorData.message || `Failed with status ${response.status}.`);
        }

        return responseBody.restaurant as RestaurantResponse;
        
    } catch (error) {
        // Fix for 'error is of type unknown'
        let errorMessage = 'A network error occurred or the server is unreachable.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};