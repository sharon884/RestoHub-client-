// src/hooks/useGeolocation.ts

import { useState, useEffect } from 'react';

interface GeolocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to get the user's current geolocation.
 * @param options Geolocation options (e.g., enableHighAccuracy, timeout).
 */
export const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: 'Geolocation is not supported by this browser.' }));
      return;
    }

    const onSuccess: PositionCallback = (position) => {
      setState(s => ({
        ...s,
        loading: false,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
      }));
    };

    const onError: PositionErrorCallback = (error) => {
      let errorMessage = 'An unknown error occurred.';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'User denied geolocation request.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information is unavailable.';
      }
      
      setState(s => ({ ...s, loading: false, error: errorMessage }));
    };

    // Request the location
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Note: No cleanup needed for getCurrentPosition
  }, [options]);

  return state;
};