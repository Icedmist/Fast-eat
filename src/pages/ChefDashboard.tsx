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
  ChevronDown,
  Lock,
  Shield,
  MapPin,
  Trash2,
  Map as MapIcon,
  MessageSquare,
  Clock3,
  ChevronLeft,
  Navigation2,
  ChevronRight,
  Settings,
  Search,
  CheckCheck,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'messages' | 'profile'>('menu');
  const [activeMetric, setActiveMetric] = useState<'orders' | 'revenue' | 'rating' | 'average'>('orders');
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
  });
  const [standardPrepTime, setStandardPrepTime] = useState('25');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock activity data datasets
  const activityData = {
    orders: {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [30, 25, 15, 22, 10, 28, 5],
        path: "M0,30 C10,30 20,25 30,25 C40,25 50,15 60,15 C70,15 80,22 90,22 C95,22 100,5 100,5",
        area: "M0,40 L0,30 C10,30 20,25 30,25 C40,25 50,15 60,15 C70,15 80,22 90,22 C95,22 100,5 100,5 L100,40 Z"
      },
      month: {
        labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 28'],
        points: [35, 15, 25, 5, 20],
        path: "M0,35 C20,35 30,15 40,15 C50,15 60,25 80,25 C90,25 100,5 100,5",
        area: "M0,40 L0,35 C20,35 30,15 40,15 C50,15 60,25 80,25 C90,25 100,5 100,5 L100,40 Z"
      },
      year: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        points: [38, 30, 35, 10, 25, 15],
        path: "M0,38 C20,38 30,30 40,30 C50,30 60,35 70,35 C80,35 90,10 100,10",
        area: "M0,40 L0,38 C20,38 30,30 40,30 C50,30 60,35 70,35 C80,35 90,10 100,10 L100,40 Z"
      }
    },
    revenue: {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [25, 35, 20, 10, 30, 15, 5],
        path: "M0,25 C10,25 20,35 30,35 C40,35 50,20 60,20 C70,20 80,10 90,10 C95,10 100,5 100,5",
        area: "M0,40 L0,25 C10,25 20,35 30,35 C40,35 50,20 60,20 C70,20 80,10 90,10 C95,10 100,5 100,5 L100,40 Z"
      },
      month: {
        labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 28'],
        points: [20, 30, 10, 25, 15],
        path: "M0,20 C20,20 30,30 40,30 C50,30 60,10 80,10 C90,10 100,15 100,15",
        area: "M0,40 L0,20 C20,20 30,30 40,30 C50,30 60,10 80,10 C90,10 100,15 100,15 L100,40 Z"
      },
      year: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        points: [30, 20, 25, 35, 15, 5],
        path: "M0,30 C20,30 30,20 40,20 C50,20 60,25 70,25 C80,25 90,35 100,35",
        area: "M0,40 L0,30 C20,30 30,20 40,20 C50,20 60,25 70,25 C80,25 90,35 100,35 L100,40 Z"
      }
    },
    rating: {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [5, 5, 8, 5, 12, 5, 5],
        path: "M0,5 L20,5 L30,8 L40,5 L60,12 L80,5 L100,5",
        area: "M0,40 L0,5 L20,5 L30,8 L40,5 L60,12 L80,5 L100,5 L100,40 Z"
      },
      month: {
        labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 28'],
        points: [8, 5, 5, 15, 5],
        path: "M0,8 C20,8 30,5 40,5 C50,5 60,15 80,15 C90,15 100,5 100,5",
        area: "M0,40 L0,8 C20,8 30,5 40,5 C50,5 60,15 80,15 C90,15 100,5 100,5 L100,40 Z"
      },
      year: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        points: [10, 5, 5, 5, 5, 5],
        path: "M0,10 L20,5 L40,5 L60,5 L80,5 L100,5",
        area: "M0,40 L0,10 L20,5 L40,5 L60,5 L80,5 L100,5 L100,40 Z"
      }
    },
    average: {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [35, 32, 28, 25, 20, 15, 10],
        path: "M0,35 L100,10",
        area: "M0,40 L0,35 L100,10 L100,40 Z"
      },
      month: {
        labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 28'],
        points: [30, 25, 20, 15, 10],
        path: "M0,30 L100,10",
        area: "M0,40 L0,30 L100,10 L100,40 Z"
      },
      year: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
        points: [25, 20, 15, 10, 5, 5],
        path: "M0,25 L100,5",
        area: "M0,40 L0,25 L100,5 L100,40 Z"
      }
    }
  };

  const currentData = activityData[activeMetric][timeFilter] || activityData.orders.week;

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

  const [chats] = useState([
    { id: '1', name: 'Zainab U.', lastMessage: 'Is the Tuwo ready for pickup?', time: '2 min ago', unread: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { id: '2', name: 'Musa K.', lastMessage: 'Thanks, the Masa was delicious!', time: '1h ago', unread: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { id: '3', name: 'Fatima L.', lastMessage: 'Do you offer delivery to G.R.A?', time: '3h ago', unread: false, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80' },
  ]);

  const stats = {
    todayOrders: 12,
    todayRevenue: 24500,
    rating: 4.8,
    totalReviews: 142,
    avgOrder: "₦3,450", // Added average order value
    pendingOrders: 3, // Restored for notification count
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
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Kitchen Dashboard</p>
              <h1 className="text-sm font-bold text-foreground">Chef Amina Mohammed</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Custom Location Display/Set Button (Glassmorphism) */}
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/40 backdrop-blur-md border border-white/20 shadow-soft hover:bg-card/60 transition-all active:scale-95 group"
              title="Capture Current Location"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Navigation2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-0.5">Location</p>
                <p className="text-[11px] font-bold text-foreground">Gombe Central</p>
              </div>
            </button>

            <button className="relative w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
              {stats.pendingOrders > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                  {stats.pendingOrders}
                </div>
              )}
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Active Orders */}
            <section className="w-full">
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

            {/* Recently Completed */}
            <section className="w-full">
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

            {/* Customer Reviews Section */}
            <section className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-foreground">Customer Reviews</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-700" />
                  {stats.rating} ({stats.totalReviews})
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, user: "Zainab U.", rating: 5, comment: "The Masa was extremely soft and the Kilishi was perfectly spiced! Will definitely order again.", time: "2h ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
                  { id: 2, user: "Musa K.", rating: 4, comment: "Tuwo was 10/10. Lowering one star because delivery took a bit longer than expected, but the food was worth it.", time: "5h ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" }
                ].map((review) => (
                  <div key={review.id} className="p-5 rounded-3xl bg-card border border-border shadow-soft">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} className="w-10 h-10 rounded-xl object-cover" alt={review.user} />
                        <div>
                          <p className="font-bold text-sm">{review.user}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">{review.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
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
            {/* Premium Analytics Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">Analytics</h3>
                  <p className="text-xs text-muted-foreground">Deep dive into your kitchen performance</p>
                </div>

                {/* Period Filter Toggle */}
                <div className="flex p-1 bg-secondary/50 backdrop-blur-md rounded-2xl border border-border/50">
                  {['week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFilter(period as any)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 ${timeFilter === period
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'orders', label: 'Orders', value: stats.todayOrders, icon: Package, color: 'text-blue-500' },
                  { id: 'revenue', label: 'Revenue', value: `₦${stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
                  { id: 'rating', label: 'Rating', value: stats.rating, icon: Star, color: 'text-amber-500' },
                  { id: 'average', label: 'Average Order', value: stats.avgOrder, icon: TrendingUp, color: 'text-primary' },
                ].map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setActiveMetric(metric.id as any)}
                    className={`p-6 rounded-[2rem] border transition-all text-left relative overflow-hidden group active:scale-[0.98] ${activeMetric === metric.id
                      ? 'bg-card border-primary ring-4 ring-primary/5 shadow-elevated'
                      : 'bg-card/40 border-border hover:border-primary/30 shadow-soft'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className={`w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center transition-colors ${activeMetric === metric.id ? 'bg-primary/10' : ''}`}>
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-secondary transition-colors cursor-help">
                              <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-muted-foreground transition-colors" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-card/95 backdrop-blur-md border-border/50 text-foreground font-bold text-xs p-3 rounded-2xl shadow-card">
                            <p>
                              {metric.id === 'orders' && `Total completed orders from this ${timeFilter}`}
                              {metric.id === 'revenue' && `Total kitchen earnings from this ${timeFilter}`}
                              {metric.id === 'rating' && `Average customer rating from this ${timeFilter}`}
                              {metric.id === 'average' && `Average value per order from this ${timeFilter}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{metric.label}</p>
                      <p className="text-2xl font-serif font-bold text-foreground">{metric.value}</p>
                    </div>
                    {/* Small Mini Sparkline (Visual Indicator Only) */}
                    <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <TrendingUp className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Graph Title */}
              <div className="flex items-center justify-between mt-8 mb-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {timeFilter}ly trend ({activeMetric})
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{activeMetric}</span>
                  </div>
                </div>
              </div>

              <div className="h-56 w-full relative flex gap-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] font-bold text-muted-foreground/50 py-1 select-none">
                  <span>{activeMetric === 'revenue' ? '50k' : '100'}</span>
                  <span>{activeMetric === 'revenue' ? '25k' : '50'}</span>
                  <span>0</span>
                </div>

                <div className="flex-1 relative">
                  {/* SVG Line Graph */}
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.1" className="text-border/30" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" className="text-border/30" strokeDasharray="2" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.1" className="text-border/30" />

                    {/* Area */}
                    <motion.path
                      inherit={false}
                      initial={false}
                      animate={{ d: currentData.area }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      fill="url(#lineGradient)"
                    />

                    {/* Line */}
                    <motion.path
                      inherit={false}
                      initial={false}
                      animate={{ d: currentData.path }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="0.3"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between mt-6 pl-10 pr-2">
                {currentData.labels.map(label => (
                  <span key={label} className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-border">
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
          </motion.div>
        )}

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

        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full space-y-4"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-serif font-bold text-foreground">Direct Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-9 h-10 bg-secondary/30 border-none rounded-xl text-xs w-48" />
              </div>
            </div>

            <div className="space-y-3">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full p-4 rounded-3xl bg-card border border-border shadow-soft flex items-center gap-4 hover:shadow-card transition-all active:scale-[0.98] text-left relative"
                >
                  <div className="relative">
                    <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-green-500" />
                    {chat.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-foreground truncate">{chat.name}</h4>
                      <span className="text-[10px] font-medium text-muted-foreground">{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {!chat.unread && <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      <p className={`text-xs truncate ${chat.unread ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                </button>
              ))}
            </div>

            <div className="p-8 text-center bg-secondary/10 rounded-3xl border border-dashed border-border/50">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs font-medium text-muted-foreground">End-to-end encrypted messaging</p>
            </div>
          </motion.div>
        )}


        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <h2 className="text-xl font-serif font-bold text-foreground">Chef Profile</h2>
              </div>
              <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                <Settings className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            {/* Chef Info Card (Matches Customer Profile Style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-[2.5rem] p-6 shadow-card flex items-center gap-5 border border-border/50 relative overflow-hidden group"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary relative shrink-0 border-4 border-background shadow-soft">
                <User className="w-10 h-10" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-serif font-bold text-foreground truncate group-hover:underline decoration-primary/30 transition-all">Amina B. Mohammed</h2>
                <p className="text-sm text-muted-foreground truncate font-medium">amina.kitchen@taste.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold tracking-wider uppercase">
                    Master Chef
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-orange-500 font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-orange-500" />
                    <span>Top Rated</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSettingsSection('personal')}
                className="p-3 h-auto rounded-2xl hover:bg-secondary text-primary font-bold text-xs"
              >
                Edit
              </Button>
            </motion.div>

            {/* Action Menu (Matches Customer Profile Style) */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] pl-2 opacity-60">Kitchen Controls</h3>
              <div className="bg-card rounded-[2.5rem] overflow-hidden shadow-card border border-border/50">
                {[
                  { id: 'personal', icon: User, label: 'Personal Information', sub: 'Name, Bio, Profile Photo', color: 'bg-blue-500' },
                  { id: 'business', icon: Utensils, label: 'Business Settings', sub: 'Prep Time, Working Hours, Status', color: 'bg-orange-500' },
                  { id: 'location', icon: MapPin, label: 'Restaurant Location', sub: 'Address, Delivery Radius', color: 'bg-green-500' },
                  { id: 'account', icon: Lock, label: 'Account & Security', sub: 'Password, 2FA, Security', color: 'bg-purple-500' },
                ].map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveSettingsSection(item.id)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-secondary/30 transition-all border-b last:border-0 border-border/30 group text-left"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-sm transition-transform group-active:scale-90 shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </motion.button>
                ))}
              </div>
            </section>

            <div className="pt-6">
              <Button
                variant="ghost"
                className="w-full py-8 rounded-[2.5rem] text-destructive hover:bg-destructive/5 hover:text-destructive gap-3 font-bold text-base border border-dashed border-destructive/20 active:scale-95 transition-all shadow-soft"
                onClick={() => navigate('/signin')}
              >
                <Power className="w-5 h-5" />
                Logout from Dashboard
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest opacity-40 italic">Taste Explorer • Chef Edition v2.0</p>
            </div>
          </motion.div>
        )}

        {/* Sub-form Drawer (Matches Customer App) */}
        <AnimatePresence>
          {activeSettingsSection && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveSettingsSection(null)}
                className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 max-w-5xl mx-auto bg-card rounded-t-[40px] shadow-elevated z-[101] overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto mt-4 mb-2 opacity-50 shrink-0" />
                <div className="px-6 py-4 border-b border-border/30 flex justify-between items-center shrink-0">
                  <h3 className="text-xl font-serif font-bold text-foreground capitalize">
                    {activeSettingsSection?.replace('-', ' ')}
                  </h3>
                  <button
                    onClick={() => setActiveSettingsSection(null)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-12">
                  {activeSettingsSection === 'personal' && (
                    <div className="space-y-6">
                      <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center relative border-4 border-background shadow-soft group">
                          <User className="w-10 h-10 text-primary" />
                          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-elevated border-4 border-background hover:scale-110 transition-transform">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground pl-1">Full Name</label>
                          <Input defaultValue="Amina B. Mohammed" className="h-14 rounded-2xl bg-secondary/30 border-none px-5 focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground pl-1">Kitchen Bio</label>
                          <textarea
                            className="w-full min-h-[120px] rounded-2xl bg-secondary/30 border-none p-5 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all resize-none"
                            defaultValue="Passionate about traditional Hausa cuisine with a modern twist. Specializing in Masa, Tuwo, and premium spice blends."
                          />
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-bold shadow-elevated transition-all active:scale-95 group">
                        Save Changes
                        <Check className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  )}

                  {activeSettingsSection === 'business' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 flex items-start gap-3 mb-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">These settings affect how customers see your kitchen availability and estimated delivery times.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30">
                          <div>
                            <p className="font-bold text-foreground">Standard Prep Time</p>
                            <p className="text-xs text-muted-foreground font-medium">Average minutes per order</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={standardPrepTime}
                              onChange={(e) => setStandardPrepTime(e.target.value)}
                              className="w-16 h-10 text-center rounded-xl bg-background border-none font-bold"
                            />
                            <span className="text-xs font-bold text-muted-foreground">min</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30">
                          <div>
                            <p className="font-bold text-foreground">Accepting Orders</p>
                            <p className="text-xs text-muted-foreground font-medium">Go offline to stop receiving orders</p>
                          </div>
                          <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-bold shadow-elevated">Update Kitchen Status</Button>
                    </div>
                  )}

                  {activeSettingsSection === 'location' && (
                    <div className="space-y-6">
                      <div className="h-48 rounded-3xl bg-secondary/30 border-b border-border flex items-center justify-center relative overflow-hidden">
                        <MapIcon className="w-8 h-8 text-muted-foreground/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                        <Button size="sm" variant="secondary" className="absolute bottom-4 left-4 rounded-xl font-bold gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Update Map
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground pl-1">Kitchen Address</label>
                          <Input defaultValue="No. 45 Gombe Central, Gombe State" className="h-14 rounded-2xl bg-secondary/30 border-none px-5" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-muted-foreground pl-1">Delivery Range (km)</label>
                          <Input type="number" defaultValue="5" className="h-14 rounded-2xl bg-secondary/30 border-none px-5" />
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-bold shadow-elevated">Save Location Settings</Button>
                    </div>
                  )}

                  {activeSettingsSection === 'account' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                              <Shield className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground font-medium">Add an extra layer of security</p>
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full h-14 rounded-2xl font-bold">Change Password</Button>
                      <Button variant="ghost" className="w-full h-14 text-destructive hover:bg-red-50 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Dashboard Account
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 pb-8 z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
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
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'messages' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl relative ${activeTab === 'messages' ? 'bg-primary/10' : ''}`}>
              <MessageSquare className="w-5 h-5" />
              {chats.some(c => c.unread) && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Msgs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              setActiveSettingsSection(null);
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'profile' ? 'bg-primary/10' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ChefDashboard;
