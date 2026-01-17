import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Heart } from 'lucide-react';
import { restaurants } from '@/data/restaurants';
import { Button } from '@/components/ui/button';

// Mock menu items for each category
const menuItems = {
  Appetizers: [
    { name: 'Garden Salad', price: '$12', description: 'Mixed greens, cherry tomatoes, cucumber' },
    { name: 'Soup of the Day', price: '$10', description: 'Chef\'s daily selection' },
    { name: 'Bruschetta', price: '$14', description: 'Toasted bread with tomato and basil' },
  ],
  Main: [
    { name: 'Grilled Salmon', price: '$32', description: 'Atlantic salmon with lemon butter' },
    { name: 'Filet Mignon', price: '$48', description: '8oz prime cut with red wine reduction' },
    { name: 'Pasta Primavera', price: '$24', description: 'Seasonal vegetables in cream sauce' },
  ],
  Dessert: [
    { name: 'Chocolate Lava Cake', price: '$14', description: 'Warm chocolate cake with vanilla ice cream' },
    { name: 'Cheesecake', price: '$12', description: 'New York style with berry compote' },
    { name: 'Tiramisu', price: '$13', description: 'Classic Italian coffee dessert' },
  ],
  Drinks: [
    { name: 'House Red Wine', price: '$12', description: 'Glass of selected red wine' },
    { name: 'Craft Cocktail', price: '$16', description: 'Bartender\'s special creation' },
    { name: 'Espresso', price: '$5', description: 'Double shot Italian espresso' },
  ],
};

// Mock reviews
const reviews = [
  { id: 1, name: 'Sarah M.', rating: 5, date: '2 days ago', comment: 'Absolutely incredible! The flavors were perfectly balanced.' },
  { id: 2, name: 'James K.', rating: 4, date: '1 week ago', comment: 'Great atmosphere and friendly service. Will definitely come back.' },
  { id: 3, name: 'Emily R.', rating: 5, date: '2 weeks ago', comment: 'Best dining experience in the city. Highly recommend!' },
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  const currentMenu = menuItems[restaurant.category] || menuItems.Main;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 p-3 rounded-full glass shadow-soft"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Favorite Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-12 right-5 p-3 rounded-full glass shadow-soft"
        >
          <Heart className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 -mt-8 relative z-10"
      >
        {/* Restaurant Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground mt-2 inline-block">
                {restaurant.category}
              </span>
            </div>
            <span className="text-xl font-bold text-primary">{restaurant.price}</span>
          </div>

          <p className="text-muted-foreground mb-4">{restaurant.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">{restaurant.rating}</span>
              <span className="text-muted-foreground">(128)</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>25-35 min</span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">Menu</h2>
          <div className="space-y-3">
            {currentMenu.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <span className="font-semibold text-primary ml-4">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Reviews</h2>
            <button className="text-sm text-primary font-medium">See all</button>
          </div>
          <div className="space-y-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold text-foreground">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{review.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating
                          ? 'fill-primary text-primary'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>

      {/* Fixed Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent"
      >
        <Button className="w-full h-14 text-base font-semibold rounded-2xl shadow-elevated">
          Reserve Order
        </Button>
      </motion.div>
    </div>
  );
};

export default RestaurantDetail;
