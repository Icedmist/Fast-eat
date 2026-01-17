import { motion, useDragControls, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import FoodCard from './FoodCard';
import { restaurants, type Category } from '@/data/restaurants';

const BottomSheet = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const filteredRestaurants = restaurants.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  );

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
      className="fixed bottom-0 left-0 right-0 z-50 h-[90vh] bg-background rounded-t-3xl shadow-elevated touch-none"
    >
      {/* Handle */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted" />
      </div>

      {/* Header */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Discover</h2>
            <p className="text-sm text-muted-foreground">
              {filteredRestaurants.length} dishes nearby
            </p>
          </div>
          <button className="p-2 rounded-full bg-card shadow-card hover:shadow-soft transition-shadow">
            <GripHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Categories */}
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Food Feed */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredRestaurants.map((restaurant, index) => (
            <FoodCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BottomSheet;
