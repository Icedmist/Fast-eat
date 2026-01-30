import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// This interface now correctly reflects the data structure from Supabase,
// including the nested restaurant, which can be null.
export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string; // Correct property from Supabase is image_url
  category: string;
  rating?: number;
  restaurants: { // This can be null if the restaurant is deleted
    id: string;
    name: string;
  } | null;
}

interface FoodCardProps {
  item: Dish;
  index: number;
}

const FoodCard = ({ item, index }: FoodCardProps) => {
  const navigate = useNavigate();

  // --- Start of Defensive Code ---
  // If the entire item is missing, render nothing. This prevents a crash.
  if (!item) {
    return null;
  }

  // Safely access the vendor (restaurant) ID and name.
  // Provide a fallback if the restaurant data is missing.
  const vendorId = item.restaurants?.id;
  const vendorName = item.restaurants?.name || 'Unknown Restaurant';
  
  // Hardcoded distance for now, as it's not in the database.
  const vendorDistance = "0.5km"; 

  const handleClick = () => {
    // Only allow navigation if the restaurant exists.
    if (vendorId) {
      navigate(`/restaurant/${vendorId}`);
    }
  };
  // --- End of Defensive Code ---

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      // Disable clicks and reduce opacity if the restaurant is missing.
      onClick={vendorId ? handleClick : undefined}
      className={`flex gap-4 p-3 bg-card rounded-2xl border ${vendorId ? 'cursor-pointer hover:border-primary/30 transition-all' : 'opacity-60'}`}
    >
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
        <img
          src={item.image_url} // Use the correct image_url property
          alt={item.name || 'Dish image'} // Fallback for alt text
          className="w-full h-full object-cover"
          // Prevent crash if image fails to load
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/ccc?text=?')}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground truncate pr-2">
            {item.name || 'Unnamed Dish'} {/* Fallback for name */}
          </h3>
          <span className="text-sm font-bold text-primary flex-shrink-0">
            {/* Fallback for price */}
            ₦{(item.price || 0).toLocaleString()}
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground mb-1">
          by {vendorName}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.description || 'No description available.'} {/* Fallback for description */}
        </p>
        
        <div className="flex items-center gap-3 mt-auto pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="text-xs font-medium text-foreground">
              {item.rating || 'N/A'} {/* Fallback for rating */}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{vendorDistance}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
