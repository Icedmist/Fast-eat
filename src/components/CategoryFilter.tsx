import { motion } from 'framer-motion';
import { categories, type Category } from '@/data/restaurants';

interface CategoryFilterProps {
  selected: Category | 'All';
  onSelect: (category: Category | 'All') => void;
}

const CategoryFilter = ({ selected, onSelect, isTopRated, onToggleTopRated }: CategoryFilterProps & { isTopRated?: boolean; onToggleTopRated?: () => void }) => {
  return (
    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      {/* Top Rated Filter (First Item) */}
      {onToggleTopRated && (
        <motion.button
          onClick={onToggleTopRated}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 sm:gap-2 ${isTopRated
            ? 'bg-[#eab308] text-white border border-[#eab308]'
            : 'text-muted-foreground hover:text-foreground bg-card shadow-card border border-transparent'
            }`}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isTopRated ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isTopRated ? "text-white" : ""}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Top Rated
        </motion.button>
      )}

      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onSelect(category)}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${selected === category
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground bg-card shadow-card'
            }`}
          whileTap={{ scale: 0.95 }}
        >
          {selected === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{category}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
