// src/schemas/restaurant.schema.ts

import { z } from 'zod';

// Define Reusable Enums for filtering and consistency
export const CuisineEnum = z.enum(['Italian', 'Mexican', 'Indian', 'Japanese', 'Other'], {
  message: 'Please select a valid cuisine type.',
});

export const PriceRangeEnum = z.enum(['£', '££', '£££', '££££'], {
  message: 'Please select a valid price range.',
});

// Schema for creating a new restaurant (User Input)
export const createRestaurantSchema = z.object({
  name: z.string().min(3, { message: 'Restaurant name must be at least 3 characters.' }).trim(),
  address: z.string().min(10, { message: 'A detailed address is required.' }).trim(),
  description: z.string().min(20, { message: 'A brief description is required (min 20 chars).' }).trim(),
  
  // Geospatial data input with bounds validation
  // Note: These must be validated as numbers after converting from string form state
  latitude: z.number().min(-90, { message: 'Latitude must be between -90 and 90.' }).max(90, { message: 'Latitude must be between -90 and 90.' }), 
  longitude: z.number().min(-180, { message: 'Longitude must be between -180 and 180.' }).max(180, { message: 'Longitude must be between -180 and 180.' }),
  
  // Enums for controlled data
  cuisine: CuisineEnum,
  priceRange: PriceRangeEnum,
  
  // The final submitted imageUrl from Cloudinary is a string, which can be optional/empty.
  imageUrl: z.string().url('Must be a valid URL if present').optional().or(z.literal('')),
});

// The type derived from the schema for use in the API/Controller (e.g., in restaurant.api.ts)
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;