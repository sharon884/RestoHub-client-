import React from "react";
import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer/Footer";
import AppRoutes from "./router/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <AppRoutes />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;