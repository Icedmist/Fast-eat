import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import type { Restaurant } from '@/data/restaurants';

interface FoodCardProps {
  restaurant: Restaurant;
  index: number;
}

const FoodCard = ({ restaurant, index }: FoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
    >
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {restaurant.name}
            </h3>
            <span className="text-sm font-semibold text-primary flex-shrink-0">
              {restaurant.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {restaurant.description}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-foreground">
              {restaurant.rating}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{restaurant.distance}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {restaurant.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
