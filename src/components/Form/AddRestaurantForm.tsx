// src/components/Form/AddRestaurantForm.tsx

import React, { useState } from 'react';
// FIX: Use 'import type' for type-only imports
import type { FC, ChangeEvent } from 'react'; 
import type { RestaurantFormData } from '../../ types/restaurant.types'; 

import { addRestaurant } from '../../api/restaurant.api';
import { CUISINE_OPTIONS, PRICE_OPTIONS } from '../../ types/restaurant.types';
import { useUserLocation } from '../../context/UserLocationContext'; 

// Import your custom UI components
import { Input } from '../ui/input'; 
import { Button } from '../ui/button'; 

const initialFormState: RestaurantFormData = {
  name: '',
  address: '',
  description: '',
  latitude: '',
  longitude: '',
  cuisine: '',
  priceRange: '',
  imageUrl: '',
};

const AddRestaurantForm: FC = () => { // Using FC imported as type
  const [formData, setFormData] = useState<RestaurantFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { latitude: contextLat, longitude: contextLong, loading: locationLoading, error: locationError } = useUserLocation();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocateMe = () => {
    if (contextLat && contextLong) {
      setFormData(prev => ({
        ...prev,
        latitude: contextLat,
        longitude: contextLong,
      }));
      setMessage('Location pre-filled from context.');
    } else if (locationError) {
      setMessage(`Error locating user: ${locationError}`);
    } else if (locationLoading) {
      setMessage('Location is still loading. Please wait.');
    } else {
      setMessage('Location context not available. Check browser permissions.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addRestaurant(formData);

      setMessage(`✅ Success! Restaurant added.`);
      setFormData(initialFormState); 
    } catch (error) {
      // FIX: Explicitly check if 'error' is an Error object before accessing .message
      let errorMessage = 'Submission failed due to an unknown error.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessage(`❌ Submission failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register New Restaurant</h2>
      <p className="mb-4 text-red-600">{message}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Inputs */}
        <Input label="Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
        <Input label="Address" name="address" type="text" value={formData.address} onChange={handleChange} required />
        
        {/* Description */}
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3}></textarea>

        {/* Location Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Note: The Input component is updated to accept 'label' */}
          <Input label="Latitude" name="latitude" type="number" value={formData.latitude} onChange={handleChange} required step="any" />
          <Input label="Longitude" name="longitude" type="number" value={formData.longitude} onChange={handleChange} required step="any" />
        </div>
        
        <Button 
          type="button" 
          onClick={handleLocateMe} 
          disabled={locationLoading}
          variant="outline"
          className="w-full"
        >
          {locationLoading ? 'Locating...' : 'Use Current Location'}
        </Button>

        {/* Dropdowns */}
        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
          <select name="cuisine" value={formData.cuisine} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Cuisine</option>
            {CUISINE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <select name="priceRange" value={formData.priceRange} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select Price Range</option>
            {PRICE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {/* Image URL */}
        <Input label="Image URL (Optional)" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Submitting...' : 'Add Restaurant to Database'}
        </Button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;