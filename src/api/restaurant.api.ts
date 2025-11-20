import axios from "axios";

const BASE_URL = "http://localhost:5000/api/restaurants";

// Get all restaurants
export const fetchRestaurants = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// Add a new restaurant
export const addRestaurant = async (data: { name: string; location: string }) => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};
