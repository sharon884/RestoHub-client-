// src/pages/LandingPage.tsx (UPDATED)

import React, { useEffect } from "react";
import type { FC } from "react"; // Use type import
import { useNavigate } from "react-router-dom"; // CRITICAL: Import navigate hook
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Button } from "../components/ui/button";
// import { testConnection } from "@/api/restaurant.api"; // REMOVED: Function not defined

const LandingPage: FC = () => {
  const navigate = useNavigate();

  // REMOVED: useEffect hook call to testConnection

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
        <h2 className="text-3xl font-bold">Welcome to Resto Hub</h2>
        <div className="flex gap-4">
          <Button variant="default" onClick={handleNavigate('/explore')}>
            Explore Restaurants
          </Button>
          <Button variant="secondary" onClick={handleNavigate('/add')}> 
            Add Restaurant
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;