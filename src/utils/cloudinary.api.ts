// src/utils/cloudinary.api.ts (Updated for secure environment variables)

import axios from 'axios';

// 1. Access environment variables (using import.meta.env for Vite/modern bundlers)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 2. Construct the upload URL dynamically using the Cloud Name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * @param file The file object (from an input element).
 * @returns The secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!file) {
    return ''; // Return empty string if no file is provided
  }

  // Check for required environment variables before proceeding
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration missing. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET); // Use the unsigned upload preset

  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.secure_url) {
      return response.data.secure_url as string;
    }
    
    throw new Error('Cloudinary response missing secure URL.');
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    let errorMessage = 'Image upload failed.';
    if (axios.isAxiosError(error) && error.response) {
      // Try to get a specific error message from the response body
      errorMessage = error.response.data?.error?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};