import React from "react";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-100 shadow-md">
      <h1 className="text-xl font-bold">Resto Hub</h1>
      <div className="flex gap-4">
        <Button>Home</Button>
        <Button>Explore</Button>
        <Button>Add Restaurant</Button>
      </div>
    </nav>
  );
};

export default Navbar;
