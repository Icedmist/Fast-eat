import { motion } from 'framer-motion';
import { Search, Bell, User, Filter } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import BottomSheet from '@/components/BottomSheet';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-40 px-5 pt-12 pb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-sans">Exploring</p>
            <h1 className="text-lg font-serif font-semibold text-foreground">
              Gombe, Nigeria
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-full glass shadow-soft">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-3 rounded-full glass shadow-soft">
              <Filter className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-3 rounded-full glass shadow-soft relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="p-3 rounded-full glass shadow-soft"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Map */}
      <div className="absolute inset-0 w-full h-full">
        <RestaurantMap />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet />
    </div>
  );
};

export default Discover;
