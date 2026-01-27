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
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'earnings'>('orders');
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
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            </div>

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
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Menu Items</h2>
                <p className="text-sm text-muted-foreground">Manage your dishes and availability</p>
              </div>
              <Button className="gap-2 shadow-soft">
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
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-serif font-bold text-foreground">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-card shadow-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Monthly Growth
                </h3>
                <div className="h-48 flex items-end gap-2 px-2">
                  {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${i === 3 ? 'bg-primary' : 'bg-primary/20'}`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-card shadow-card border border-border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Top Rated Dishes
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Masa Special', rating: 4.9, count: 128 },
                    { name: 'Kilishi Gold', rating: 4.8, count: 95 },
                    { name: 'Tuwo King', rating: 4.7, count: 82 },
                  ].map((dish, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                          {i + 1}
                        </div>
                        <span className="font-medium">{dish.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{dish.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'earnings' && (
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
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'orders' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'orders' ? 'bg-primary/10' : ''}`}>
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </button>
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
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'analytics' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'analytics' ? 'bg-primary/10' : ''}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'earnings' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'earnings' ? 'bg-primary/10' : ''}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Payouts</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ChefDashboard;
