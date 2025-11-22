// src/pages/ExploreRestaurants.tsx
import React, { useEffect, useState } from 'react';
import { getRestaurants } from '../api/restaurant.api';

// FIX 1: Separate 'type' imports from 'value' imports
import type { Restaurant } from '../ types/restaurant.types'; 
import { CUISINE_OPTIONS, PRICE_OPTIONS } from '../ types/restaurant.types';

// FIX 2: Removed extra space in path ('/ RestaurantCard' -> '/RestaurantCard')
import RestaurantCard from '../components/Card/ RestaurantCard';

import Navbar from '../components/Navbar/Navbar'; 
import Footer from '../components/Footer/Footer'; 
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ExploreRestaurants: React.FC = () => {
  // Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter State
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9; // Cards per page

  // Fetch Function
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      // Pass explicit empty strings if values are undefined/null to avoid API errors
      const response = await getRestaurants({
        page,
        limit: LIMIT,
        search: search || undefined,
        cuisine: cuisine || undefined,
        priceRange: priceRange || undefined
      });

      setRestaurants(response.data);
      setTotalPages(response.meta.totalPages);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load restaurants. Please try again later.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect: Trigger fetch when Page or Filters change
  useEffect(() => {
    // Debounce search slightly to avoid too many API calls while typing
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search, cuisine, priceRange]);

  // Handlers
  const handleNextPage = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Explore Restaurants</h1>
                <p className="text-gray-500 mt-1">Find the best spots near you</p>
            </div>
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="col-span-2">
                <Input 
                    placeholder="Search by name..." 
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to page 1 on search
                    }}
                />
            </div>

            {/* Cuisine Select */}
            <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={cuisine}
                onChange={(e) => {
                    setCuisine(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">All Cuisines</option>
                {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Price Select */}
            <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={priceRange}
                onChange={(e) => {
                    setPriceRange(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">Any Price</option>
                {PRICE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>

        {/* --- CONTENT SECTION --- */}
        {loading ? (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading restaurants...</p>
            </div>
        ) : error ? (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg">
                <p>{error}</p>
                <Button variant="link" onClick={fetchRestaurants}>Try Again</Button>
            </div>
        ) : restaurants.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
                <Button 
                    variant="link" 
                    onClick={() => { setSearch(''); setCuisine(''); setPriceRange(''); }}
                >
                    Clear Filters
                </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
            </div>
        )}

        {/* --- PAGINATION --- */}
        {!loading && restaurants.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-12">
                <Button 
                    variant="outline" 
                    onClick={handlePrevPage} 
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <Button 
                    variant="outline" 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ExploreRestaurants;