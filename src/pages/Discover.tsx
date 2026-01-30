import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BottomSheet from '@/components/BottomSheet';
import RestaurantMap from '@/components/RestaurantMap';
import type { Dish } from '@/components/FoodCard';

export interface FilterState {
  searchTerm: string;
  category: string | 'All';
  topRated: boolean;
}

const Discover = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isMapVisible, setMapVisible] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'All',
    topRated: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [restaurantsRes, dishesRes] = await Promise.all([
          supabase.from('restaurants').select('*'),
          supabase.from('dishes').select('*, restaurants(*, location)')
        ]);

        if (restaurantsRes.error || dishesRes.error) {
            throw new Error(restaurantsRes.error?.message || dishesRes.error?.message || 'An unknown error occurred');
        }

        setRestaurants(restaurantsRes.data || []);
        
        const validDishes = (dishesRes.data || []).filter(dish => dish.restaurants);
        setAllDishes(validDishes as Dish[]);

      } catch (err: any) {
        console.error('Error fetching discovery data:', err);
        setError('Could not load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDishes = useMemo(() => {
    return (allDishes || []).filter(dish => {
      if (filters.topRated && (!dish.rating || dish.rating < 4.5)) return false;
      if (filters.category !== 'All' && dish.category !== filters.category) return false;
      
      const searchTerm = filters.searchTerm.toLowerCase();
      if (searchTerm) {
          const nameMatch = dish.name.toLowerCase().includes(searchTerm);
          const restaurantNameMatch = dish.restaurants?.name.toLowerCase().includes(searchTerm);
          if (!nameMatch && !restaurantNameMatch) return false;
      }

      return true;
    });
  }, [allDishes, filters]);

  const visibleRestaurants = useMemo(() => {
    const restaurantIds = new Set(filteredDishes.map(dish => dish.restaurants!.id));
    return restaurants.filter(r => restaurantIds.has(r.id));
  }, [filteredDishes, restaurants]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      {/* Map is always rendered, but its visibility is toggled */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isMapVisible ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
        <RestaurantMap
          restaurants={visibleRestaurants}
          onToggleView={() => setMapVisible(false)}
        />
      </div>

      {/* List View (BottomSheet) is always present but hidden/shown */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${!isMapVisible ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
         <BottomSheet
            items={filteredDishes}
            filters={filters}
            onFilterChange={setFilters}
            onToggleView={() => setMapVisible(true)}
            isLoading={isLoading} // Pass loading state down
            error={error}       // Pass error state down
        />
      </div>
    </div>
  );
};

export default Discover;
