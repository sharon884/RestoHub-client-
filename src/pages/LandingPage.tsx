import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Button } from "../components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
        <h2 className="text-3xl font-bold">Welcome to Resto Hub</h2>
        <div className="flex gap-4">
          <Button variant="default">Explore Restaurants</Button>
          <Button variant="default">Add Restaurant</Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
