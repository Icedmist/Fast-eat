import { motion } from 'framer-motion';
import { categories, type Category } from '@/data/restaurants';

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onSelect(category)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selected === category
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
