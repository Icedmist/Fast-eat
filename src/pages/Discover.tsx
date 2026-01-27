import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Filter, Maximize2, Minimize2, MessageCircle } from 'lucide-react';
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
          <div>
            <p className="text-sm text-muted-foreground font-sans">Exploring</p>
            <h1 className="text-lg font-serif font-semibold text-foreground">
              Gombe, Nigeria
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsListFullScreen(!isListFullScreen)}
              className="p-3 rounded-full glass shadow-soft bg-white/80"
            >
              {isListFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
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

      {/* Bottom Sheet Layer - Always rendered, controls its own height based on isFullScreen */}
      <BottomSheet
        items={filteredFoodItems}
        filters={filters}
        onFilterChange={setFilters}
        isFullScreen={isListFullScreen}
      />
    </div>
  );
};

export default Discover;
