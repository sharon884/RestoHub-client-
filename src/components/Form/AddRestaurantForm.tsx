// src/components/Form/AddRestaurantForm.tsx (FIXED)

import React, { useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react'; 
import { Input } from '../ui/input'; 
import { Button } from '../ui/button'; 
import { useUserLocation } from '../../context/UserLocationContext'; 
import { addRestaurant } from '../../api/restaurant.api';
import { ZodError } from 'zod';

// 💥 IMPORT TYPES for implicit 'any' fix
import type { RestaurantFormData, CuisineType, PriceRangeType } from '../../ types/restaurant.types'; 

import { CUISINE_OPTIONS, PRICE_OPTIONS } from '../../ types/restaurant.types';
import { createRestaurantSchema } from '../../schemas/restaurant.schema.ts';
import { uploadImageToCloudinary } from '../../utils/cloudinary.api';
import LocationPicker from '../Map/LocationPicker.tsx';

// Default location if geolocation fails (e.g., London, UK)
const DEFAULT_LAT = 51.509865;
const DEFAULT_LONG = -0.118092;

const initialFormState: RestaurantFormData = {
  name: '',
  address: '',
  description: '',
  latitude: '',
  longitude: '',
  cuisine: '',
  priceRange: '',
  imageFile: null, // NEW
  imageUrl: '',   // NEW
};

const AddRestaurantForm: FC = () => {
  const [formData, setFormData] = useState<RestaurantFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isClientSideValid, setIsClientSideValid] = useState(true);
  
  // Get global location
  const { latitude: contextLat, longitude: contextLong, loading: locationLoading } = useUserLocation();

  // EFFECT: Set initial map center using user's location on load
  useEffect(() => {
    if (contextLat !== null && contextLong !== null) {
      // 🛠️ FIX 1: Explicitly type 'prev' as RestaurantFormData
      setFormData((prev: RestaurantFormData) => ({
        ...prev,
        latitude: contextLat,
        longitude: contextLong,
      }));
    } else if (!locationLoading && formData.latitude === '') {
        // Set default location if loading finished and no coordinates are set
        // 🛠️ FIX 1: Explicitly type 'prev' as RestaurantFormData
        setFormData((prev: RestaurantFormData) => ({
            ...prev,
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LONG,
        }));
    }
  }, [contextLat, contextLong, locationLoading]);

  // Handler for standard text/select inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // 🛠️ FIX 1: Explicitly type 'prev' as RestaurantFormData
    setFormData((prev: RestaurantFormData) => ({ ...prev, [name]: value }));
  };

  // Handler for file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // 🛠️ FIX 1: Explicitly type 'prev' as RestaurantFormData
    setFormData((prev: RestaurantFormData) => ({ ...prev, imageFile: file }));
  };
  
  // Handler for map updates (Lat/Long are numbers here)
  const handleLocationChange = (lat: number, long: number) => {
    // 🛠️ FIX 1: Explicitly type 'prev' as RestaurantFormData
    setFormData((prev: RestaurantFormData) => ({
      ...prev,
      latitude: lat,
      longitude: long,
    }));
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // --- 1. ZOD CLIENT-SIDE VALIDATION ---
    const dataToValidate = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
    };
    
    const validationResult = createRestaurantSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        setLoading(false);
        setIsClientSideValid(false);
        
        // 🛠️ THE FIX: 
        // 1. Explicitly type validationResult.error as ZodError.
        // 2. Change .errors to .issues (the correct Zod property).
        const validationError = validationResult.error as ZodError; 
        const firstError = validationError.issues[0];
        setMessage(`❌ Validation Error on ${firstError.path.join('.')}: ${firstError.message}`);
        return;
    }
    setIsClientSideValid(true);

    try {
        let finalImageUrl = '';

        // --- 2. CLOUDINARY UPLOAD ---
        if (formData.imageFile) {
            setMessage('Uploading image to Cloudinary...');
            finalImageUrl = await uploadImageToCloudinary(formData.imageFile);
            setMessage('Image uploaded successfully. Submitting restaurant data...');
        }
        
        // --- 3. API SUBMISSION ---
        const finalData = {
            ...validationResult.data, // Use Zod-validated data
            imageUrl: finalImageUrl, // Add the final Cloudinary URL
        };
        
        await addRestaurant(finalData);

        setMessage(`✅ Success! Restaurant added.`);
        setFormData(initialFormState); // Reset form
    } catch (error) {
        let errorMessage = 'Submission failed due to an unknown error.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        setMessage(`❌ Submission failed: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };

  // Ensure lat/long are available for the map component
  const initialMapLat = typeof formData.latitude === 'number' ? formData.latitude : DEFAULT_LAT;
  const initialMapLong = typeof formData.longitude === 'number' ? formData.longitude : DEFAULT_LONG;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-center">Add New Restaurant</h3>
      {message && (
        <p className={`p-3 rounded mb-4 text-sm ${message.startsWith('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </p>
      )}

      {/* 4. Disable HTML5 Validation */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate> 
        
        {/* Basic Fields */}
        <Input label="Restaurant Name" name="name" type="text" value={formData.name} onChange={handleChange} />
        <Input label="Full Address" name="address" type="text" value={formData.address} onChange={handleChange} />
        <Input label="Description" name="description" type="text" value={formData.description} onChange={handleChange} />

        {/* --- Location Picker (REPLACES LAT/LONG INPUTS) --- */}
        <div className="space-y-2 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700">
                Location (Click map or drag marker)
                <span className='text-xs text-gray-500 ml-2'>({locationLoading ? 'Locating...' : 'Using current location or default'})</span>
            </label>
            <LocationPicker 
                initialLat={initialMapLat}
                initialLong={initialMapLong}
                onLocationChange={handleLocationChange}
            />
        </div>
        
        {/* Hidden/Readonly Lat/Long for Confirmation */}
        <div className="flex space-x-4">
            <Input 
                label={`Latitude`} 
                name="latitude" 
                type="number" 
                value={initialMapLat} 
                readOnly 
                className="bg-gray-50"
            />
            <Input 
                label={`Longitude`} 
                name="longitude" 
                type="number" 
                value={initialMapLong} 
                readOnly 
                className="bg-gray-50"
            />
        </div>
        
        {/* File Input */}
        <Input 
            label="Restaurant Image" 
            name="imageFile" 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*"
        />

        {/* Dropdowns */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
          <select name="cuisine" value={formData.cuisine} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Cuisine</option>
            {/* 🛠️ FIX 2: Explicitly type 'option' as CuisineType */}
            {CUISINE_OPTIONS.map((option: CuisineType) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <select name="priceRange" value={formData.priceRange} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Price Range</option>
            {/* 🛠️ FIX 2: Explicitly type 'option' as PriceRangeType */}
            {PRICE_OPTIONS.map((option: PriceRangeType) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>


        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processing...' : 'Add Restaurant to Database'}
        </Button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;