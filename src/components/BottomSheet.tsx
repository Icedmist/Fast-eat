import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GripHorizontal, Star, UtensilsCrossed } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import FoodCard, { FoodItem } from './FoodCard'; // Import FoodItem type
import { FilterState } from '@/pages/Discover';

interface BottomSheetProps {
  items: FoodItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isFullScreen?: boolean;
}

const BottomSheet = ({ items, filters, onFilterChange, isFullScreen = false }: BottomSheetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const handleDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    // If fullscreen, drag might be disabled or just for pull down? 
    // For now, let's keep standard behavior but maybe disable drag if fullscreen?
    // Or let drag close fullscreen? Let's keep it simple: drag works as before, affecting isExpanded.
    // If isFullScreen is passed, it overrides isExpanded visual state for Y position.

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
  }, [isExpanded, isFullScreen, y]);

  // Toggle Filters
  const toggleTopRated = () => onFilterChange({ ...filters, topRated: !filters.topRated });

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{
        // If fullscreen, go to top (0). Else rely on isExpanded state.
        y: isFullScreen ? 0 : (isExpanded ? '10%' : '60%'),
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      drag={isFullScreen ? false : "y"} // Disable drag when fullscreen? Or allow drag to exit? User said button toggles it. Safety: disable drag when fullscreen.
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ y }}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-elevated touch-none flex flex-col ${isFullScreen ? 'h-[100vh] rounded-none' : 'h-[90vh]'}`}
    >
      {/* Handle - Hide if fullscreen? Or keep as visual indicator? Keep for consistency but inactive */}
      {!isFullScreen && (
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 rounded-full bg-muted" />
        </div>
      )}

      {isFullScreen && <div className="h-14" />} {/* Spacer for header when fullscreen */}

      {/* Header */}
      <div className="px-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Discover</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} dish{items.length !== 1 ? 'es' : ''} nearby
            </p>
          </div>
          {!isFullScreen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full bg-card shadow-card hover:shadow-soft transition-shadow"
            >
              <GripHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Categories & Top Rated */}
        <CategoryFilter
          selected={filters.category}
          onSelect={(category) => onFilterChange({ ...filters, category })}
          isTopRated={filters.topRated}
          onToggleTopRated={toggleTopRated}
        />
      </div>

      {/* Food Feed */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
        {items.map((item, index) => (
          <FoodCard
            key={item.id}
            item={item} // Pass item prop
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BottomSheet;
