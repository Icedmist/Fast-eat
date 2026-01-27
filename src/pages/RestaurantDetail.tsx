import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Heart, MessageCircle, ShoppingBag, X, Plus, Minus, History, Info } from 'lucide-react';
import { restaurants } from '@/data/restaurants';
import { Button } from '@/components/ui/button';

// Mock menu items for vendor specific foods
// Using realistic Nigerian food examples as requested (Yoghurt, Jollof, etc)
// Added images property (mock URLs)
const menuItems = {
  Appetizers: [
    { id: 'a1', name: 'Zobo Drink', price: 1500, description: 'Chilled hibiscus tea with ginger and cloves', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=200' },
    { id: 'a2', name: 'Parfait Yoghurt', price: 3500, description: 'Greek yoghurt with granola and fresh fruits', image: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&q=80&w=200' },
    { id: 'a3', name: 'Spicy Snail', price: 4500, description: 'Peppered snail in spicy sauce', image: 'https://images.unsplash.com/photo-1606756790138-7c488320e54f?auto=format&fit=crop&q=80&w=200' },
  ],
  Main: [
    { id: 'm1', name: 'Smokey Jollof Rice', price: 4500, description: 'Classic Nigerian jollof with fried beef', image: 'https://images.unsplash.com/photo-1626509653294-46324888846c?auto=format&fit=crop&q=80&w=200' },
    { id: 'm2', name: 'Pounded Yam & Egusi', price: 6000, description: 'Served with assorted meat and stock fish', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200' },
    { id: 'm3', name: 'Fried Rice & Turkey', price: 5500, description: 'Basmati fried rice with giant turkey wing', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200' },
  ],
  Dessert: [
    { id: 'd1', name: 'Red Velvet Cake', price: 4000, description: 'Moist slice with cream cheese frosting', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=200' },
    { id: 'd2', name: 'Pancakes', price: 3000, description: 'Fluffy pancakes with syrup and berries', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=200' },
    { id: 'd3', name: 'Meat Pie', price: 1200, description: 'Rich pastry filled with minced meat and potatoes', image: 'https://images.unsplash.com/photo-1572383672419-ab4779963fb0?auto=format&fit=crop&q=80&w=200' },
  ],
  Drinks: [
    { id: 'dr1', name: 'Fresh Fruit Juice', price: 2000, description: '100% natural watermelon and pineapple mix', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=200' },
    { id: 'dr2', name: 'Tigernut Milk', price: 1500, description: 'Creamy chilled kunu aya', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=200' },
    { id: 'dr3', name: 'Smoothie', price: 2500, description: 'Banana, strawberry and yogurt blend', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=200' },
  ],
};

// Mock reviews
const reviews = [
  { id: 1, name: 'Amina B.', rating: 5, date: '2 days ago', comment: 'The Jollof was exactly how I like it. Smokey and spicy!' },
  { id: 2, name: 'Chinedu O.', rating: 4, date: '1 week ago', comment: 'Great service, packaged really well.' },
  { id: 3, name: 'Fatima Y.', rating: 5, date: '2 weeks ago', comment: 'Best Zobo in town. Highly recommend!' },
];

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find((r) => r.id === id);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vendor profile not found</p>
      </div>
    );
  }

  const currentMenu = menuItems[restaurant.category] || menuItems.Main;

  const addToOrder = (item: any) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    }
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems((prev) => prev.map((i) => {
      if (i.id === itemId) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    }));
  };

  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Sidebar Component for reuse
  const OrderSummary = () => (
    <div className="bg-card rounded-2xl p-6 shadow-card h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-serif mb-2">Your Order</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Estimated prep: 20-30 min</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-6 custom-scrollbar">
        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Your basket is empty</p>
            <p className="text-xs mt-1 text-muted-foreground">Start adding items from the vendor's menu!</p>
          </div>
        ) : (
          orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                <span className="text-primary font-bold text-sm">₦{item.price * item.quantity}</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                <button
                  onClick={() => item.quantity === 1 ? removeFromOrder(item.id) : updateQuantity(item.id, -1)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-background transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-medium text-xs w-3 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-6 h-6 rounded flex items-center justify-center bg-primary text-white shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Orders Section */}
      <div className="pt-4 border-t border-border mb-4">
        <button className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
          <span className="flex items-center gap-2"><History className="w-4 h-4" /> Past Orders</span>
          <span className="bg-secondary px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">2</span>
        </button>
      </div>

      <div className="border-t border-border pt-4 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">₦{orderTotal.toLocaleString()}</span>
        </div>
        <Button className="w-full py-6 text-base font-bold rounded-xl shadow-md" disabled={orderItems.length === 0}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24 relative">
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
          className="absolute top-12 left-5 p-3 rounded-full glass shadow-soft z-20"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Action Buttons */}
        <div className="absolute top-12 right-5 flex gap-3 z-20">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(`/chat/${restaurant.id}`)}
            className="p-3 rounded-full bg-primary text-white shadow-soft hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>

          <div className="relative">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 rounded-full glass shadow-soft hover:bg-white/80 transition-colors"
            >
              <Info className="w-5 h-5 text-foreground" />
            </motion.button>

            {/* Info Popover */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl shadow-xl p-4 z-50 border border-border/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm">Working Hours</h3>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Open Now</span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 8:00 PM</span></p>
                    <p className="flex justify-between"><span>Sat:</span> <span>10:00 AM - 10:00 PM</span></p>
                    <p className="flex justify-between text-destructive"><span>Sun:</span> <span>Closed</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-full glass shadow-soft"
          >
            <Heart className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 -mt-8 relative z-10 transition-all duration-300">
        <div className="grid md:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Info Card - RESTORED ORIGINAL DESIGN (rounded-2xl, p-5) */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
                  {/* Vendor Type Badge */}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground mt-2 inline-block">
                    Verified Vendor
                  </span>
                </div>
                {/* REMOVED MAIN PRICE as requested for Vendor Profile context */}
              </div>

              <p className="text-muted-foreground mb-4">
                Specializing in delicious Nigerian delicacies like {restaurant.category === 'Main' ? 'Smokey Jollof' : 'Local treats'} and more.
                Full menu available below.
              </p>

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

            {/* Menu Section - RESTORED ORIGINAL STYLING WITH IMAGE */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">Menu</h2>
              <div className="space-y-3">
                {currentMenu.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-card rounded-xl p-3 shadow-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {/* Menu Item Image (Added as requested, minimal layout impact) */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                          <span className="font-bold text-primary mt-2 block">₦{item.price.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0 self-center">
                          <Button
                            size="sm"
                            onClick={() => addToOrder(item)}
                            variant="secondary"
                            className="h-8 px-4 text-xs rounded-lg hover:bg-primary hover:text-white transition-colors"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Reviews Section - RESTORED ORIGINAL STYLING */}
            <section className="mb-24 md:mb-0">
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
                          className={`w-3.5 h-3.5 ${i < review.rating
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
            </section>
          </motion.div>

          {/* Desktop Sidebar (Sticky) - PRESERVED */}
          <div className="hidden md:block relative">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Order Button (Visible only on mobile when items exist) */}
      <AnimatePresence>
        {!isSidebarOpen && orderItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 right-6 z-30 md:hidden"
          >
            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full h-14 rounded-2xl bg-primary text-white shadow-elevated flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {orderItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
                <span>View Order</span>
              </div>
              <span className="font-bold">₦{orderTotal.toLocaleString()}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer (Sidebar content as a Sheet) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-background z-50 rounded-t-3xl shadow-2xl p-0 overflow-hidden"
            >
              <div className="flex items-center justify-end p-4 absolute top-0 right-0 z-10">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-full pt-10 pb-4 px-4">
                <OrderSummary />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantDetail;
