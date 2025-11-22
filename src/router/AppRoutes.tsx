import React from "react";
import { Routes, Route } from "react-router-dom";

// Import your pages
import LandingPage from "../pages/LandingPage";
// import ExploreRestaurants from "../pages/ExploreRestaurants";
import AddRestaurant from "../pages/AddRestaurantPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/explore" element={<ExploreRestaurants />} /> */}
      <Route path="/add" element={<AddRestaurant />} />
    </Routes>
  );
};

export default AppRoutes;
