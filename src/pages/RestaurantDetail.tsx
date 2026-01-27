import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Heart, MessageCircle, ShoppingBag, X, Plus, Minus, History, Info } from 'lucide-react';
import { restaurants } from '@/data/restaurants';
import { Button } from '@/components/ui/button';

// Mock menu items for vendor specific foods
// Using realistic Nigerian food examples as requested (Yoghurt, Jollof, etc)
// Added images property (mock URLs)
// No fake menuItems, we use restaurant.menu

// Helper to group menu items by category
const getCategorizedMenu = (menu: any[]) => {
  const grouped: Record<string, any[]> = {};
  menu.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return grouped;
};

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

  // Redirect if not found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vendor profile not found</p>
      </div>
    );
  }

  const addToOrder = (item: any) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
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

  // Mock Past Orders Data
  const pastOrders = [
    { id: 'po1', date: '21 Jan', items: [{ name: 'Jollof Rice', quantity: 2 }, { name: 'Fried Plantain', quantity: 1 }], total: 4500 },
    { id: 'po2', date: '15 Jan', items: [{ name: 'Peppered Snail', quantity: 1 }], total: 4500 },
  ];

  const [showPastOrders, setShowPastOrders] = useState(false);

  const handleReorder = (items: any[]) => {
    // Logic to add these items to current car
    // For simplicity, let's just REPLACE current cart or ADD? 
    // "Order past order again" implies adding them.

    // Better approach: Just find items in restaurant.menu
    const menuItems = restaurant?.menu || [];
    const itemsToAdd = items.map(pastItem => {
      const menuItem = menuItems.find(m => m.name === pastItem.name);
      if (menuItem) {
        return {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: pastItem.quantity
        };
      }
      return null;
    }).filter(Boolean) as OrderItem[];

    setOrderItems(prev => {
      // Merge logic? or Replace? 
      // Let's Append-Merge.
      let next = [...prev];
      itemsToAdd.forEach(newItem => {
        const existing = next.find(x => x.id === newItem.id);
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          next.push(newItem);
        }
      });
      return next;
    });
    setShowPastOrders(false);
    if (window.innerWidth < 768) setIsSidebarOpen(true); // Open cart to show added items
  };

  interface OrderSummaryProps {
    isFixed?: boolean;
  }

  const OrderSummary = ({ isFixed }: OrderSummaryProps) => (
    <div className={`bg-card flex flex-col ${isFixed ? 'h-screen rounded-none border-l' : 'rounded-2xl shadow-card h-full p-6'}`}>
      <div className={`mb-6 ${isFixed ? 'p-6 pb-0' : ''}`}>
        <h2 className="text-xl font-bold font-serif mb-2">Your Order</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Estimated prep: 20-30 min</span>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-4 pr-1 mb-6 custom-scrollbar ${isFixed ? 'px-6' : ''}`}>
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
                <span className="text-primary font-bold text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
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
      <div className={`pt-4 border-t border-border mb-4 ${isFixed ? 'mx-6' : ''}`}>
        <button
          onClick={() => setShowPastOrders(true)}
          className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="flex items-center gap-2"><History className="w-4 h-4" /> Past Orders</span>
          <span className="bg-secondary px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">2</span>
        </button>
      </div>

      <div className={`border-t border-border pt-4 mt-auto ${isFixed ? 'p-6 pt-4' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">₦{orderTotal.toLocaleString()}</span>
        </div>
        <Button
          onClick={() => navigate('/checkout', { state: { orderItems, total: orderTotal, restaurantName: restaurant.name } })}
          className="w-full py-6 text-base font-bold rounded-xl shadow-md"
          disabled={orderItems.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );

  const categorizedMenu = getCategorizedMenu(restaurant.menu);
  const menuCategories = Object.keys(categorizedMenu);

  // Mock reviews
  const reviews = [
    { id: 1, name: 'Amina B.', rating: 5, date: '2 days ago', comment: 'The Jollof was exactly how I like it. Smokey and spicy!' },
    { id: 2, name: 'Chinedu O.', rating: 4, date: '1 week ago', comment: 'Great service, packaged really well.' },
    { id: 3, name: 'Fatima Y.', rating: 5, date: '2 weeks ago', comment: 'Best Zobo in town. Highly recommend!' },
  ];

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
        <div className="absolute top-12 right-5 md:right-[370px] flex gap-3 z-20">
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
                    {restaurant.workingHours.map((wh, idx) => (
                      <p key={idx} className="flex justify-between">
                        <span>{wh.day}:</span> <span>{wh.open} - {wh.close}</span>
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate(`/chat/${restaurant.id}`)}
            className="p-3 rounded-full bg-primary text-white shadow-soft hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-full glass shadow-soft"
          >
            <Heart className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 -mt-8 relative z-10 pb-20">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground font-serif">{restaurant.name}</h1>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground mt-2 inline-block">
                    Verified Vendor
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                {restaurant.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
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

            {/* Menu Sections */}
            {menuCategories.map((category) => (
              <section key={category} className="space-y-4">
                <h2 className="text-lg font-bold text-foreground capitalize font-serif">{category}</h2>
                <div className="grid gap-4">
                  {categorizedMenu[category].map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="bg-card rounded-xl p-3 shadow-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                            <span className="font-bold text-primary mt-2 block text-md">₦{item.price.toLocaleString()}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addToOrder(item)}
                            variant="secondary"
                            className="h-10 px-6 font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}

            {/* Reviews Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground font-serif">Reviews</h2>
                <button className="text-sm text-primary font-medium hover:underline">See all reviews</button>
              </div>
              <div className="grid gap-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-card rounded-xl p-4 shadow-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="text-sm font-bold">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{review.name}</p>
                          <span className="text-[10px] text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'fill-muted text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Desktop Sidebar (Fixed) */}
          <aside className="hidden md:block w-[350px] relative">
            <div className="fixed top-0 right-0 h-screen w-[350px] bg-card border-l border-border z-[100] shadow-2xl">
              <OrderSummary isFixed />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Floating Order Button */}
      <AnimatePresence>
        {!isSidebarOpen && orderItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
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
                <span className="font-bold">View Order</span>
              </div>
              <span className="font-bold text-lg">₦{orderTotal.toLocaleString()}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 h-[85dvh] bg-background rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-muted" onClick={() => setIsSidebarOpen(false)} />
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <OrderSummary />
              </div>
              {/* Extra close for convenience */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Past Orders Modal */}
      <AnimatePresence>
        {showPastOrders && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPastOrders(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-background rounded-t-3xl md:rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-serif">Past Orders</h2>
                <button
                  onClick={() => setShowPastOrders(false)}
                  className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {pastOrders.map((order) => (
                  <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{order.date}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.items.length} items</p>
                      </div>
                      <span className="font-bold text-primary text-lg">₦{order.total.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary rounded-xl h-12 font-bold"
                      onClick={() => handleReorder(order.items)}
                    >
                      Reorder Items
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantDetail;
