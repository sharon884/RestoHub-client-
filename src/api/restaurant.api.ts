// src/api/restaurant.api.ts (Corrected with Axios)

// 1. Import Axios
import axios from 'axios'; 
// Use 'import type' for type-only imports
import type { RestaurantFormData, RestaurantResponse } from '../ types/restaurant.types';

// Assuming your environment variable is set correctly
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interface for API error structure, which is common for Express backends
interface ApiErrorResponse {
    message: string;
    errors?: any; // e.g., detailed Zod validation errors
}

/**
 * Submits new restaurant data to the backend API using Axios.
 */
export const addRestaurant = async (data: RestaurantFormData): Promise<RestaurantResponse> => {
    
    const payload = {
        ...data,
        // Ensure conversion to Number as required by your Zod schema/controller
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        // Note: imageFile is excluded here since it's only for the form, 
        // and we only send the final imageUrl
    };

    try {
        // 2. Use axios.post()
        // We type the expected response data structure based on the backend controller
        const response = await axios.post<
            { message: string; restaurant: RestaurantResponse }
        >(
            API_BASE_URL, 
            payload // Axios serializes this object to JSON automatically
        );
        
        // Axios automatically throws an error for non-2xx status codes.
        // On success (201 CREATED), the data is in response.data.
        return response.data.restaurant;
        
    } catch (error) {
        let errorMessage = 'A network error occurred or the server is unreachable.';

        // 3. Robust Axios Error Handling
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The server responded with a status code outside the 2xx range (e.g., 400, 500)
                const errorData: ApiErrorResponse = error.response.data;
                
                // Use the error message from the backend (e.g., from Zod validation)
                errorMessage = errorData.message || `Request failed with status ${error.response.status}.`;
            } else if (error.request) {
                // The request was made but no response was received (e.g., server offline)
                errorMessage = 'No response received from the server.';
            }
        } else if (error instanceof Error) {
            // General JavaScript error
            errorMessage = error.message;
        }

        // Re-throw the error to be handled by the component (AddRestaurantForm.tsx)
        throw new Error(errorMessage);
    }
};