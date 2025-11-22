// src/pages/AddRestaurantPage.tsx (UPDATED)

import React from 'react';
import type { FC } from 'react';
import AddRestaurantForm from '../components/Form/AddRestaurantForm';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

const AddRestaurantPage: FC = () => {
  return (
  
    <div className="min-h-screen flex flex-col">
     <Navbar/>
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-lg mx-auto">
                <AddRestaurantForm />
            </div>
        </main>

        <Footer/>
    </div>
  );
};

export default AddRestaurantPage;