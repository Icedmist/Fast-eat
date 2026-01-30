import { motion } from 'framer-motion';
import FoodCard, { Dish } from './FoodCard';
import CategoryFilter from './CategoryFilter';
import { Input } from './ui/input';
import { Search, Map, WifiOff } from 'lucide-react';
import type { FilterState } from '@/pages/Discover';

interface BottomSheetProps {
  items: Dish[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onToggleView: () => void;
  isLoading: boolean;
  error: string | null;
}

// A skeleton placeholder component that mimics the FoodCard layout
const FoodCardSkeleton = () => (
  <div className="flex items-start space-x-4 p-3 bg-card rounded-2xl animate-pulse">
    <div className="w-24 h-24 rounded-xl bg-secondary shrink-0"></div>
    <div className="flex-1 space-y-3 pt-1">
      <div className="h-5 bg-secondary rounded w-3/4"></div>
      <div className="h-4 bg-secondary rounded w-full"></div>
      <div className="h-4 bg-secondary rounded w-1/2"></div>
    </div>
  </div>
);

const BottomSheet = ({ items, filters, onFilterChange, onToggleView, isLoading, error }: BottomSheetProps) => {

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <FoodCardSkeleton key={index} />
      ));
    }

    if (error) {
      return (
        <div className="text-center py-20 flex flex-col items-center">
          <WifiOff className="w-12 h-12 text-destructive/50 mb-4"/>
          <p className="text-lg font-medium text-destructive">Loading Failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-20">
            <p className="text-lg font-medium text-muted-foreground">No Results</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return items.map((item, index) => (
      <FoodCard
        key={item.id}
        item={item}
        index={index}
      />
    ));
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="relative w-full h-full bg-card flex flex-col pt-24"
    >
      {/* Header stuck to the top */}
      <div className="absolute top-0 left-0 right-0 bg-card rounded-t-3xl shadow-lg z-10 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-2xl font-bold font-serif text-foreground">Explore</h2>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'Searching for food...' : `${items.length} result${items.length !== 1 ? 's' : ''} found`}
                </p>
            </div>
            <motion.button 
                onClick={onToggleView}
                className="flex items-center gap-2 font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full"
                whileTap={{scale: 0.95}}
            >
                <Map size={16}/>
                <span>Map</span>
            </motion.button>
        </div>

        <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
            <Input 
                placeholder="Search for dishes or restaurants..."
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                className="pl-10 h-12 rounded-xl border-border/50 bg-secondary/50"
            />
        </div>
        
        <CategoryFilter 
          selected={filters.category}
          onSelect={(category) => onFilterChange({ ...filters, category })}
          isTopRated={filters.topRated}
          onToggleTopRated={() => onFilterChange({ ...filters, topRated: !filters.topRated })}
        />
      </div>

      {/* Scrollable Food Feed */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3 custom-scrollbar">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default BottomSheet;
