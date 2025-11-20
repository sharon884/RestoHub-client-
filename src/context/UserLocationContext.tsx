// src/context/UserLocationContext.tsx

import React, { createContext, useContext } from 'react';
import type { ReactNode, FC } from 'react'; // <-- FIX: Imported as type
import { useGeolocation } from '../hooks/useGeolocation';

interface UserLocationContextType {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

const UserLocationContext = createContext<UserLocationContextType | undefined>(undefined);

interface UserLocationProviderProps {
  children: ReactNode; // Uses the imported type ReactNode
}

// Using FC (Functional Component) instead of React.FC, also imported as type
export const UserLocationProvider: FC<UserLocationProviderProps> = ({ children }) => { 
  const { coords, loading, error } = useGeolocation({ enableHighAccuracy: false, timeout: 5000 });

  const contextValue: UserLocationContextType = {
    latitude: coords?.latitude ?? null,
    longitude: coords?.longitude ?? null,
    loading,
    error,
  };

  return (
    <UserLocationContext.Provider value={contextValue}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const context = useContext(UserLocationContext);
  if (context === undefined) {
    throw new Error('useUserLocation must be used within a UserLocationProvider');
  }
  return context;
};