import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 bg-zinc-100 mt-10 shadow-inner">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Resto Hub. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
