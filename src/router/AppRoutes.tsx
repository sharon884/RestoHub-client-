import React from "react";
import { Routes, Route } from "react-router-dom";

// Import your pages
import LandingPage from "../pages/LandingPage";
import ExploreRestaurants from "../pages/ExploreRestaurants";
import AddRestaurant from "../pages/AddRestaurantPage";
import RestaurantDetail from '../pages/RestaurantDetail'; 

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExploreRestaurants />} />
      <Route path="/add" element={<AddRestaurant />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
    </Routes>
  );
};

export default AppRoutes;
