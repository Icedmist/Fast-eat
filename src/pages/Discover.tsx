import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Filter, Maximize2, Minimize2, MessageCircle } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import BottomSheet from '@/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { restaurants, type Category } from '@/data/restaurants';

export type FilterState = {
  category: Category;
  topRated: boolean;
  masa: boolean;
};

const Discover = () => {
  const navigate = useNavigate();
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    topRated: false,
    masa: false,
  });

  // Filter Logic
  const filteredRestaurants = restaurants.filter((r) => {
    // 1. Category Filter
    if (filters.category !== 'All' && r.category !== filters.category) return false;

    // 2. Top Rated Filter (> 4.7)
    if (filters.topRated && r.rating <= 4.7) return false;

    // 3. Masa Filter (checks tags)
    if (filters.masa && !r.tags?.includes('Masa')) return false;

    return true;
  });

  // Handler for list expansion (hides map)
  const handleListExpand = (expanded: boolean) => {
    // If list expands fully, map is effectively hidden/backgrounded
    // We can use isMapFullScreen to mean "Map is the PRIMARY view"
    // So if list expands, map is NOT full screen (it's covered)
    // But we might need a separate state for "Map Visibility" if we want to fade it out
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      {/* Header - Only visible when map is NOT full screen or we want controls overlay */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-40 px-5 pt-12 pb-4 pointer-events-none"
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <p className="text-sm text-muted-foreground font-sans">Exploring</p>
            <h1 className="text-lg font-serif font-semibold text-foreground">
              Gombe, Nigeria
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMapFullScreen(!isMapFullScreen)}
              className="p-3 rounded-full glass shadow-soft bg-white/80"
            >
              {isMapFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="p-3 rounded-full glass shadow-soft bg-white/80 relative"
            >
              <MessageCircle className="w-5 h-5 text-foreground" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
            </button>
            <button className="p-3 rounded-full glass shadow-soft bg-white/80 relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-3 rounded-full glass shadow-soft bg-white/80"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Map Layer */}
      <div className="absolute inset-0 w-full h-full">
        <RestaurantMap
          restaurants={filteredRestaurants}
          isFullScreen={isMapFullScreen}
          onExitFullScreen={() => setIsMapFullScreen(false)}
        />
      </div>

      {/* Bottom Sheet Layer - Hidden when Map is Full Screen */}
      <AnimatePresence>
        {!isMapFullScreen && (
          <BottomSheet
            restaurants={filteredRestaurants}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;
