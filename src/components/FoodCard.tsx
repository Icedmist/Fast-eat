import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '@/data/restaurants';

export interface FoodItem extends MenuItem {
  vendorId: string;
  vendorName: string;
  vendorDistance: string;
}

interface FoodCardProps {
  item: FoodItem; // Changed from restaurant
  index: number;
}

const FoodCard = ({ item, index }: FoodCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${item.vendorId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={handleClick}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
              {item.name}
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-primary flex-shrink-0">
              ₦{item.price.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1">
            by {item.vendorName}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {item.rating || 4.5}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-xs sm:text-sm">{item.vendorDistance}</span>
          </div>
          <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
