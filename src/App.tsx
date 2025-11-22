// src/App.tsx (UPDATED)

import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { UserLocationProvider } from "./context/UserLocationContext"; // 1. IMPORT

function App() {
  return (
    <BrowserRouter>
      {/* 2. WRAP the entire app with the location provider */}
      <UserLocationProvider> 
        <AppRoutes />
      </UserLocationProvider>
    </BrowserRouter>
  );
}

export default App;