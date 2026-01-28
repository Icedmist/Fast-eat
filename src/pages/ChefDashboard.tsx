import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Clock,
  DollarSign,
  Star,
  Package,
  Bell,
  Plus,
  Power,
  Check,
  TrendingUp,
  AlertCircle,
  Image,
  Utensils,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  available: boolean;
  orders: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up';
  time: string;
}

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'payouts' | 'profile'>('menu');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
  });
  const [standardPrepTime, setStandardPrepTime] = useState('25');
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock activity data datasets
  const activityData = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      points: [30, 25, 15, 5, 5], // y values for SVG
      path: "M0,30 Q15,10 30,25 T60,15 T90,5 L100,5",
      area: "M0,40 L0,30 Q15,10 30,25 T60,15 T90,5 L100,5 L100,40 Z"
    },
    'month': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      points: [35, 20, 45, 15],
      path: "M0,35 Q25,10 50,45 T100,15",
      area: "M0,40 L0,35 Q25,10 50,45 T100,15 L100,40 Z"
    },
    'q2': {
      labels: ['Apr', 'May', 'Jun'],
      points: [40, 15, 5],
      path: "M0,40 Q50,5 100,5",
      area: "M0,40 Q50,5 100,5 L100,40 Z"
    },
    'year': {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      points: [35, 30, 25, 20, 15, 5],
      path: "M0,35 Q20,25 40,25 T80,15 T100,5",
      area: "M0,40 L0,35 Q20,25 40,25 T80,15 T100,5 L100,40 Z"
    }
  };

  const currentData = activityData[timeFilter as keyof typeof activityData] || activityData['7d'];

  const [orderHistory] = useState([
    { id: 'ORD000', customerName: 'Zainab U.', items: ['Tuwo x1'], total: 800, status: 'picked_up' as const, time: '2h ago' },
    { id: 'ORD999', customerName: 'Musa K.', items: ['Masa x10'], total: 2000, status: 'picked_up' as const, time: '3h ago' },
  ]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Masa', price: 500, available: true, orders: 24, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
    { id: '2', name: 'Kilishi (100g)', price: 1500, available: true, orders: 18, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80' },
    { id: '3', name: 'Tuwo Shinkafa', price: 800, available: false, orders: 12, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80' },
    { id: '4', name: 'Miyan Kuka', price: 600, available: true, orders: 30, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=80' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD001', customerName: 'Amina B.', items: ['Masa x3', 'Kilishi x1'], total: 3000, status: 'pending', time: '2 min ago' },
    { id: 'ORD002', customerName: 'Ibrahim M.', items: ['Tuwo Shinkafa x2'], total: 1600, status: 'preparing', time: '8 min ago' },
    { id: 'ORD003', customerName: 'Fatima A.', items: ['Miyan Kuka x1', 'Masa x5'], total: 3100, status: 'ready', time: '15 min ago' },
  ]);

  const stats = {
    todayOrders: 12,
    todayRevenue: 24500,
    rating: 4.8,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const markAsReady = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'ready' as const } : order
      )
    );
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'picked_up': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-foreground">Chef Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Chef Amina</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Online/Offline Toggle */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary">
                <Power className={`w-4 h-4 ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
              </div>

              {/* Notifications */}
              <button className="relative p-3 rounded-full bg-secondary hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
                {stats.pendingOrders > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32">
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Active Orders */}
            <section className="max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-foreground">Active Orders</h2>
                <span className="text-sm text-muted-foreground">{orders.length} orders</span>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-card shadow-card border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.id} • {order.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">{order.items.join(', ')}</p>
                      <p className="text-lg font-semibold text-foreground mt-1">₦{order.total.toLocaleString()}</p>
                    </div>

                    {order.status === 'pending' && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'preparing' } : o))}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Start Preparing
                      </Button>
                    )}

                    {order.status === 'preparing' && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markAsReady(order.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Food is Ready
                      </Button>
                    )}

                    {order.status === 'ready' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Waiting for rider (2 min window)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Order History */}
            <section className="max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-foreground">Recently Completed</h2>
              </div>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between opacity-70">
                    <div>
                      <p className="font-bold text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.items.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₦{order.total.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Business Stats Grid (Moved here) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Orders</span>
                </div>
                <p className="text-2xl font-serif font-bold">{stats.todayOrders}</p>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Revenue</span>
                </div>
                <p className="text-2xl font-serif font-bold">₦{stats.todayRevenue.toLocaleString()}</p>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rating</span>
                </div>
                <p className="text-2xl font-serif font-bold">{stats.rating}</p>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending</span>
                </div>
                <p className="text-2xl font-serif font-bold">{stats.pendingOrders}</p>
              </div>
            </div>

            {/* Activity Line Graph */}
            <div className="p-6 rounded-[2.5rem] bg-card border border-border shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Store Activity
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/80 border border-border/50 rounded-xl px-4 py-2 text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                  >
                    <span>
                      {timeFilter === '7d' && "Last 7 Days"}
                      {timeFilter === 'month' && "This Month"}
                      {timeFilter === 'q2' && "Q2 2025"}
                      {timeFilter === 'q3' && "Q3 2025"}
                      {timeFilter === 'q4' && "Q4 2025"}
                      {timeFilter === 'year' && "Full Year 2025"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsFilterOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-card/90 backdrop-blur-xl border border-border shadow-elevated rounded-2xl p-2 z-50 overflow-hidden"
                        >
                          <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-1">
                            Select Period
                          </div>
                          {[
                            { id: '7d', label: 'Last 7 Days' },
                            { id: 'month', label: 'This Month' },
                            { id: 'q2', label: 'Q2 2025' },
                            { id: 'q3', label: 'Q3 2025' },
                            { id: 'q4', label: 'Q4 2025' },
                            { id: 'year', label: 'Full Year 2025' },
                          ].map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setTimeFilter(option.id);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between group ${timeFilter === option.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-secondary text-foreground'
                                }`}
                            >
                              {option.label}
                              {timeFilter === option.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="h-40 w-full relative">
                {/* SVG Line Graph */}
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area */}
                  <motion.path
                    inherit={false}
                    initial={false}
                    animate={{ d: currentData.area }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    fill="url(#lineGradient)"
                  />

                  {/* Line */}
                  <motion.path
                    inherit={false}
                    initial={false}
                    animate={{ d: currentData.path }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />

                  {/* Points */}
                  {currentData.points.map((y, i) => {
                    const x = (i / (currentData.points.length - 1)) * 100;
                    return (
                      <motion.circle
                        key={`${timeFilter}-${i}`}
                        inherit={false}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, cx: x, cy: y }}
                        transition={{ delay: i * 0.05 }}
                        r="1.2"
                        fill="white"
                        stroke="var(--primary)"
                        strokeWidth="0.6"
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="flex justify-between mt-6 px-1">
                {currentData.labels.map(label => (
                  <span key={label} className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Menu Items</h2>
                  <p className="text-sm text-muted-foreground">Manage your dishes and availability</p>
                </div>
                <Button
                  onClick={() => setIsAddingItem(true)}
                  className="gap-2 shadow-soft"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border group hover:border-primary/30 transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-foreground truncate">{item.name}</h3>
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => toggleItemAvailability(item.id)}
                          className="scale-90"
                        />
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-1">
                        <span className="font-bold text-primary">₦{item.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>4.8</span>
                          <span>•</span>
                          <span>{item.orders} orders</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Item Modal Overlay */}
            <AnimatePresence>
              {isAddingItem && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddingItem(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-card rounded-t-[2.5rem] shadow-elevated z-[101] overflow-y-auto px-6 pt-8 pb-12"
                  >
                    <div className="max-w-xl mx-auto">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-serif font-bold">Add New Dish</h2>
                          <p className="text-sm text-muted-foreground">Fill in the details for your new menu item</p>
                        </div>
                        <button
                          onClick={() => setIsAddingItem(false)}
                          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted"
                        >
                          <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Dish Name</label>
                            <Input
                              placeholder="e.g. Traditional Masa"
                              className="rounded-2xl bg-secondary/30 border-none h-14 px-5 text-lg"
                              value={newDish.name}
                              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Price (₦)</label>
                              <Input
                                type="number"
                                placeholder="500"
                                className="rounded-2xl bg-secondary/30 border-none h-14 px-5"
                                value={newDish.price}
                                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Category</label>
                              <select
                                className="w-full rounded-2xl bg-secondary/30 border-none h-14 px-5 text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                                value={newDish.category}
                                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                              >
                                <option>Main Course</option>
                                <option>Appetizers</option>
                                <option>Desserts</option>
                                <option>Beverages</option>
                                <option>Traditional Specials</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Details removed (calories and prep time) */}

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Description</label>
                          <textarea
                            className="w-full rounded-3xl bg-secondary/30 border-none p-5 min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Describe how this dish is prepared and what makes it special..."
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                          />
                        </div>

                        {/* Image Upload Placeholder */}
                        <div className="p-8 border-2 border-dashed border-border rounded-3xl bg-secondary/20 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/30 transition-colors">
                          <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Image className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold">Click to upload photo</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1 py-7 rounded-2xl font-bold border-2"
                            onClick={() => setIsAddingItem(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-[2] py-7 rounded-2xl font-bold shadow-elevated"
                            onClick={() => {
                              if (newDish.name && newDish.price) {
                                setMenuItems([...menuItems, {
                                  id: (menuItems.length + 1).toString(),
                                  name: newDish.name,
                                  price: parseInt(newDish.price),
                                  available: true,
                                  orders: 0,
                                  image: newDish.image
                                }]);
                                setIsAddingItem(false);
                                setNewDish({
                                  name: '',
                                  price: '',
                                  category: 'Main Course',
                                  description: '',
                                  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
                                });
                              }
                            }}
                          >
                            Save Dish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                <ChefHat className="w-12 h-12" />
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-foreground">Chef Amina B.</h2>
                <p className="text-muted-foreground font-sans uppercase tracking-[0.2em] text-[10px] font-bold">Executive Chef • Gombe</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-card border border-border shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Full Name</label>
                    <Input defaultValue="Amina B. Mohammed" className="rounded-2xl bg-secondary/30 border-none h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Restaurant Name</label>
                    <Input defaultValue="Amina's Northern Kitchen" className="rounded-2xl bg-secondary/30 border-none h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Professional Bio</label>
                    <textarea
                      className="w-full rounded-2xl bg-secondary/30 border-none p-4 min-h-[100px] text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      defaultValue="Traditional northern Nigerian cuisine expert with over 12 years of experience. Specializing in authentic Gombe delicacies."
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Contact Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Email Address</label>
                    <Input defaultValue="amina.kitchen@example.com" className="rounded-2xl bg-secondary/30 border-none h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Phone Number</label>
                    <Input defaultValue="+234 803 123 4567" className="rounded-2xl bg-secondary/30 border-none h-12 px-4" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Business Settings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Standard Preparation Time (mins)</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={standardPrepTime}
                        onChange={(e) => setStandardPrepTime(e.target.value)}
                        className="rounded-2xl bg-secondary/30 border-none h-12 px-4 w-32"
                      />
                      <span className="text-sm text-muted-foreground font-medium">Average time per order</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full py-6 rounded-2xl font-bold shadow-elevated">Save Changes</Button>
            </div>
          </motion.div>
        )}

        {activeTab === 'payouts' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-serif font-bold text-foreground">Earnings</h2>

            <div className="p-8 rounded-[2.5rem] bg-primary text-primary-foreground shadow-elevated overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-primary-foreground/70 mb-1 text-sm font-medium uppercase tracking-wider">Total Balance</p>
                <p className="text-4xl font-serif font-bold mb-6">₦142,500.00</p>
                <Button variant="secondary" className="rounded-full px-8 py-6 font-bold">Withdraw Funds</Button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Recent Payouts</h3>
              <div className="space-y-2">
                {[
                  { id: '#PYT001', date: 'Oct 24, 2023', amount: 25000, status: 'Completed' },
                  { id: '#PYT002', date: 'Oct 17, 2023', amount: 32000, status: 'Completed' },
                  { id: '#PYT003', date: 'Oct 10, 2023', amount: 18500, status: 'Completed' },
                ].map((pyt) => (
                  <div key={pyt.id} className="flex items-center justify-between p-5 rounded-3xl bg-card border border-border shadow-card hover:shadow-soft transition-all">
                    <div>
                      <p className="font-bold">{pyt.id}</p>
                      <p className="text-sm text-muted-foreground">{pyt.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₦{pyt.amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">{pyt.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 pb-8 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'menu' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'menu' ? 'bg-primary/10' : ''}`}>
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'orders' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'orders' ? 'bg-primary/10' : ''}`}>
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics' as any)} // Fallback if still named analytics in some parts of logic
            className="hidden"
          >
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'payouts' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'payouts' ? 'bg-primary/10' : ''}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'profile' ? 'bg-primary/10' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ChefDashboard;
