// src/pages/AddRestaurantPage.tsx (UPDATED)

import React from 'react';
import type { FC } from 'react';
import AddRestaurantForm from '../components/Form/AddRestaurantForm';
// Context import is no longer needed here!
// import { UserLocationProvider } from '../context/UserLocationContext'; 

const AddRestaurantPage: FC = () => {
  return (
    // Context is now provided in App.tsx
    <div className="min-h-screen flex flex-col">
        {/* ... Navbar and Footer remain ... */}
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-lg mx-auto">
                <AddRestaurantForm />
            </div>
        </main>
    </div>
  );
};

export default AddRestaurantPage;