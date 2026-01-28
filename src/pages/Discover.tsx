import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Filter, Maximize2, Minimize2, MessageCircle, Navigation2, MapPin } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import BottomSheet from '@/components/BottomSheet';
import { useNavigate } from 'react-router-dom';
import { restaurants, type Category } from '@/data/restaurants';

export type FilterState = {
  category: Category | 'All';
  topRated: boolean;
  masa: boolean;
};

const Discover = () => {
  const navigate = useNavigate();
  const [isListFullScreen, setIsListFullScreen] = useState(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    topRated: false,
    masa: false,
  });

  // Flatten all menu items with vendor info for the Feed
  const allFoodItems = restaurants.flatMap(vendor =>
    vendor.menu.map(item => ({
      ...item,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorDistance: vendor.distance,
      vendorRating: vendor.rating
    }))
  );

  // Filter Logic for Food Items
  const filteredFoodItems = allFoodItems.filter((item) => {
    // 1. Category Filter
    if (filters.category !== 'All' && item.category !== filters.category) return false;

    // 2. Top Rated Filter (> 4.5) - using item rating or vendor rating fallback
    const rating = item.rating || 4.5;
    if (filters.topRated && rating < 4.5) return false;

    // 3. Masa Filter (checks if item name or description contains Masa, or vendor tag)
    if (filters.masa) {
      const isMasaItem = item.name.toLowerCase().includes('masa') || item.description.toLowerCase().includes('masa');
      // Also check if vendor is a Masa spot
      const vendor = restaurants.find(r => r.id === item.vendorId);
      const isMasaVendor = vendor?.tags.includes('Masa');

      if (!isMasaItem && !isMasaVendor) return false;
    }

    return true;
  });

  // Filter Logic for Map (Vendors)
  // Show vendors that have at least one item in the filtered list
  const activeVendorIds = new Set(filteredFoodItems.map(i => i.vendorId));
  const filteredRestaurants = restaurants.filter(r => activeVendorIds.has(r.id));

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      {/* Header - Always visible, higher z-index to stay above fullscreen list */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-[60] px-5 pt-12 pb-4 pointer-events-none"
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/20 shadow-soft hover:bg-white transition-all active:scale-95 group pointer-events-auto"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Navigation2 className="w-4 h-4" />
              </div>
              <div className="text-left text-foreground">
                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-0.5">Your Location</p>
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-bold truncate max-w-[120px]">
                    Gombe, Nigeria
                  </h1>
                </div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                setIsMapFullScreen(!isMapFullScreen);
                if (isListFullScreen) setIsListFullScreen(false);
              }}
              className="p-2.5 sm:p-3 rounded-full glass shadow-soft bg-white/80"
            >
              {isMapFullScreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="p-2.5 sm:p-3 rounded-full glass shadow-soft bg-white/80 relative"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white" />
            </button>
            <button className="p-2.5 sm:p-3 rounded-full glass shadow-soft bg-white/80 relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-2.5 sm:p-3 rounded-full glass shadow-soft bg-white/80"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Map Layer - Only visible when list is NOT fullscreen */}
      {!isListFullScreen && (
        <div className="absolute inset-0 w-full h-full">
          <RestaurantMap
            restaurants={filteredRestaurants}
            isFullScreen={false} // Map is never fullscreen in this new logic
            onExitFullScreen={() => { }}
          />
        </div>
      )}

      {/* Bottom Sheet Layer - Always rendered, unless map is full screen */}
      {!isMapFullScreen && (
        <BottomSheet
          items={filteredFoodItems}
          filters={filters}
          onFilterChange={setFilters}
          isFullScreen={isListFullScreen}
        />
      )}
    </div>
  );
};

export default Discover;
