import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";


const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-100 shadow-md">
      <h1 className="text-xl font-bold">Resto Hub</h1>
      <div className="flex gap-4">
        <Link to="/">
          <Button>Home</Button>
        </Link>

        <Link to="/explore">
          <Button>Explore</Button>
        </Link>
        <Link to="/add">
          <Button>Add Restaurant</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
