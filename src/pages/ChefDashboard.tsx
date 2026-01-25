import { useState } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Today's Orders</span>
            </div>
            <p className="text-3xl font-serif font-bold text-foreground">{stats.todayOrders}</p>
          </div>

          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <p className="text-3xl font-serif font-bold text-foreground">₦{stats.todayRevenue.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-muted-foreground">Rating</span>
            </div>
            <p className="text-3xl font-serif font-bold text-foreground">{stats.rating}</p>
          </div>

          <div className="p-5 rounded-2xl bg-card shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-3xl font-serif font-bold text-foreground">{stats.pendingOrders}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Orders */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
                      onClick={() => setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'preparing'} : o))}
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
          </motion.section>

          {/* Menu Management */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-foreground">Menu Items</h2>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleItemAvailability(item.id)}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-medium text-primary">₦{item.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">{item.orders} orders today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button 
            onClick={() => navigate('/discover')}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChefHat className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Earnings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ChefDashboard;
