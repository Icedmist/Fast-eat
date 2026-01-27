import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GripHorizontal, Star, UtensilsCrossed } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import FoodCard from './FoodCard';
import { Restaurant } from '@/data/restaurants';
import { FilterState } from '@/pages/Discover';

interface BottomSheetProps {
  restaurants: Restaurant[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const BottomSheet = ({ restaurants, filters, onFilterChange }: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const shouldExpand = info.offset.y < -50 || info.velocity.y < -500;
    const shouldCollapse = info.offset.y > 50 || info.velocity.y > 500;

    if (shouldExpand) {
      setIsExpanded(true);
    } else if (shouldCollapse) {
      setIsExpanded(false);
    }
  };

  // Reset y position when expansion state changes
  useEffect(() => {
    y.set(0);
  }, [isExpanded, y]);

  // Toggle Filters
  const toggleMasa = () => onFilterChange({ ...filters, masa: !filters.masa });
  const toggleTopRated = () => onFilterChange({ ...filters, topRated: !filters.topRated });

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{
        y: isExpanded ? '10%' : '60%',
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      drag="y"
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ y }}
      className="fixed bottom-0 left-0 right-0 z-50 h-[90vh] bg-background rounded-t-3xl shadow-elevated touch-none flex flex-col"
    >
      {/* Handle */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted" />
      </div>

      {/* Header */}
      <div className="px-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Discover</h2>
            <p className="text-sm text-muted-foreground">
              {restaurants.length} dishes nearby
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-card shadow-card hover:shadow-soft transition-shadow"
          >
            <GripHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Categories */}
        <CategoryFilter
          selected={filters.category}
          onSelect={(category) => onFilterChange({ ...filters, category })}
        />

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={toggleMasa}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filters.masa
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50'
              }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Masa Special
          </button>
          <button
            onClick={toggleTopRated}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filters.topRated
                ? 'bg-[#eab308] text-white border-[#eab308]'
                : 'bg-card text-muted-foreground border-border hover:border-[#eab308]/50'
              }`}
          >
            <Star className={`w-3.5 h-3.5 ${filters.topRated ? 'fill-current' : ''}`} />
            Top Rated
          </button>
        </div>
      </div>

      {/* Food Feed */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
        {restaurants.map((restaurant, index) => (
          <FoodCard
            key={restaurant.id}
            restaurant={restaurant}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BottomSheet;
