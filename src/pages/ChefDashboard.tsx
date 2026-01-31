import { useState, useEffect } from 'react';
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
  Lock,
  MapPin,
  Trash2,
  Map as MapIcon,
  MessageSquare,
  ChevronLeft,
  Navigation2,
  ChevronRight,
  Settings,
  Search,
  CheckCheck,
  Info,
  Loader2
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
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

// --- Data Models ---
interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string; // "lat,lng"
  prep_time: number;
  is_accepting_orders: boolean;
  owner_id: string;
  delivery_range: number;
}

interface Dish {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image_url: string;
  category: string;
  description: string;
  restaurant_id: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    dishes: { name: string } | null;
}

interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'completed';
  created_at: string;
  order_items: OrderItem[];
  profiles: { full_name: string } | null;
}

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'messages' | 'profile'>('menu');
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  const [editingProfile, setEditingProfile] = useState<Partial<Profile>>({});
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Partial<Restaurant>>({ name: '', address: '', prep_time: 20, is_accepting_orders: true, delivery_range: 5 });

  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'Main Course', description: '', imageFile: null as File | null });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/signin'); return; }
      setUser(user);

      try {
        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profileError) throw new Error(`Could not fetch profile: ${profileError.message}`);
        setProfile(profileData);

        const { data: restaurantData, error: restaurantError } = await supabase.from('restaurants').select('*').eq('owner_id', user.id).single();
        
        if (restaurantError && restaurantError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
            throw new Error(`Could not fetch restaurant: ${restaurantError.message}`);
        }
        
        if (restaurantData) {
            setRestaurant(restaurantData);
            const [menuResult, ordersResult] = await Promise.all([
                supabase.from('dishes').select('*').eq('restaurant_id', restaurantData.id),
                supabase.from('orders').select('*, order_items(*, dishes(name)), profiles(full_name)').eq('restaurant_id', restaurantData.id).order('created_at', { ascending: false })
            ]);
            if (menuResult.error) throw new Error(`Could not fetch menu: ${menuResult.error.message}`);
            setMenuItems(menuResult.data || []);
            if (ordersResult.error) throw new Error(`Could not fetch orders: ${ordersResult.error.message}`);
            setOrders(ordersResult.data as Order[] || []);
        } else {
            // This is a new chef, guide them to create a restaurant
            setActiveTab('profile');
            setActiveSettingsSection('business');
        }
      } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeSettingsSection === 'personal' && profile) setEditingProfile(profile);
    if ((activeSettingsSection === 'business' || activeSettingsSection === 'location')) {
        setEditingRestaurant(restaurant || { name: '', address: '', prep_time: 20, is_accepting_orders: true, delivery_range: 5 });
    }
  }, [activeSettingsSection, profile, restaurant]);

  const handleImageUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    const { error } = await supabase.storage.from('image-bucket').upload(filePath, file);
    if (error) { console.error('Error uploading image:', error); return null; }
    const { data } = supabase.storage.from('image-bucket').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleProfileUpdate = async () => {
    if (!profile || !user) return;
    setIsSubmitting(true);
    let changes: Partial<Profile> = { full_name: editingProfile.full_name, bio: editingProfile.bio };
    if (profileImageFile) {
      const avatarUrl = await handleImageUpload(profileImageFile, `avatars/${user.id}`);
      if(avatarUrl) changes.avatar_url = avatarUrl;
    }
    const { data, error } = await supabase.from('profiles').update(changes).eq('id', user.id).select().single();
    if (error) alert('Failed to update profile: ' + error.message);
    else if (data) { setProfile(data); setActiveSettingsSection(null); }
    setProfileImageFile(null);
    setIsSubmitting(false);
  };

  const handleSaveRestaurant = async () => {
      if (!user) return;
      setIsSubmitting(true);
      if (restaurant) { // Update existing restaurant
          const { data, error } = await supabase.from('restaurants').update(editingRestaurant).eq('id', restaurant.id).select().single();
          if (error) alert('Failed to update settings: ' + error.message);
          else if (data) { setRestaurant(data); setActiveSettingsSection(null); }
      } else { // Create new restaurant
          const { data, error } = await supabase.from('restaurants').insert({ ...editingRestaurant, owner_id: user.id }).select().single();
          if (error) alert('Failed to create restaurant: ' + error.message);
          else if (data) { setRestaurant(data); setActiveSettingsSection(null); }
      }
      setIsSubmitting(false);
  };

  const handleCreateDish = async () => {
    if (!newDish.name || !newDish.price || !restaurant) return;
    setIsSubmitting(true);
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
    if (newDish.imageFile) {
      const uploadedUrl = await handleImageUpload(newDish.imageFile, `restaurants/${restaurant.id}`);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }
    const { data, error } = await supabase.from('dishes').insert([{ name: newDish.name, price: parseFloat(newDish.price), category: newDish.category, description: newDish.description, image_url: imageUrl, restaurant_id: restaurant.id }]).select().single();
    if (error) alert('Failed to add dish: ' + error.message);
    else if (data) { setMenuItems([...menuItems, data]); setIsAddingItem(false); setNewDish({ name: '', price: '', category: 'Main Course', description: '', imageFile: null }); }
    setIsSubmitting(false);
  };

  const toggleItemAvailability = async (item: Dish) => {
    const { data, error } = await supabase.from('dishes').update({ available: !item.available }).eq('id', item.id).select().single();
    if (error) alert('Could not update item.');
    else if(data) setMenuItems(items => items.map(i => (i.id === item.id ? data : i)));
  };
  
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select('*, order_items(*, dishes(name)), profiles(full_name)').single();
    if (error) alert('Failed to update status.');
    else if (data) setOrders(prev => prev.map(o => (o.id === orderId ? data as Order : o)));
  };

  const getStatusColor = (status: Order['status']) => ({ pending: 'bg-amber-100 text-amber-700', preparing: 'bg-blue-100 text-blue-700', ready: 'bg-green-100 text-green-700', picked_up: 'bg-muted text-muted-foreground', completed: 'bg-muted text-muted-foreground' })[status] || 'bg-muted text-muted-foreground';

  if (isLoading) return <div className="w-full h-screen flex flex-col items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /><p className="text-muted-foreground mt-4">Loading your kitchen...</p></div>;
  if (error) return <div className="w-full h-screen flex flex-col items-center justify-center bg-background"><AlertCircle className="w-12 h-12 text-destructive/50 mb-4"/><p className="text-red-500 font-semibold mb-2">An Error Occurred</p><p className="text-sm text-muted-foreground max-w-sm text-center mb-6">{error}</p><Button onClick={() => window.location.reload()}>Try Again</Button></div>;
  
  // This view is now only shown if the user manually closes the creation form
  if (!restaurant && activeTab !== 'profile') return <div className="w-full h-screen flex flex-col items-center justify-center bg-background text-center px-6"><ChefHat className="w-12 h-12 text-primary/50 mb-4"/><h1 className="text-2xl font-serif font-bold mb-2">Welcome, Chef!</h1><p className="text-muted-foreground max-w-md mb-6">Your kitchen isn't set up yet. Go to your profile settings to create your restaurant.</p><Button onClick={() => { setActiveTab('profile'); setActiveSettingsSection('business'); }} className="shadow-elevated"><Settings className="w-4 h-4 mr-2"/>Go to Settings</Button></div>

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'picked_up');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4 z-40">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile?.avatar_url} alt={profile?.full_name} className="w-10 h-10 rounded-2xl bg-primary/10 object-cover"/>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Kitchen Dashboard</p>
              <h1 className="text-sm font-bold text-foreground">{profile?.full_name || 'Chef'}</h1>
            </div>
          </div>
          {restaurant && (
            <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase leading-none mb-0.5">{restaurant.is_accepting_orders ? 'Online' : 'Offline'}</p>
                    <p className={`text-[11px] font-bold ${restaurant.is_accepting_orders ? 'text-green-500' : 'text-red-500'}`}>{restaurant.name}</p>
                </div>
                <button className="relative w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                {activeOrders.filter(o => o.status === 'pending').length > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">{activeOrders.filter(o => o.status === 'pending').length}</div>}
                <Bell className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold">Your Menu</h2>
                  <Button onClick={() => setIsAddingItem(true)} className="shadow-elevated"><Plus className="w-4 h-4 mr-2"/>Add New Dish</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden flex flex-col">
                      <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4 flex-1">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                          <Switch checked={item.available} onCheckedChange={() => toggleItemAvailability(item)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                 {menuItems.length === 0 && !isAddingItem && (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <Utensils className="w-10 h-10 mx-auto text-muted-foreground/50 mb-4"/>
                        <h3 className="font-bold text-lg mb-1">Your menu is empty</h3>
                        <p className="text-muted-foreground text-sm">Add your first dish to get started!</p>
                    </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                 <h2 className="text-2xl font-serif font-bold mb-6">Active Orders</h2>
                 <div className="space-y-4 mb-12">
                     {activeOrders.map(order => (
                         <div key={order.id} className="bg-card border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                             <div className="flex-1">
                                <p className="font-bold text-sm">#{order.id.substring(0, 8)}</p>
                                <p className="text-lg font-bold text-foreground">{order.profiles?.full_name || 'Customer'}</p>
                                <p className="text-muted-foreground text-xs">{new Date(order.created_at).toLocaleString()}</p>
                                <div className="flex gap-2 mt-2">
                                  {order.order_items.map(oi => <span key={oi.id} className="text-xs bg-secondary/50 px-2 py-1 rounded-md">{oi.quantity}x {oi.dishes?.name}</span>)}
                                </div>
                             </div>
                             <div className="flex flex-col items-end justify-between gap-2">
                                 <p className="font-bold text-lg text-primary">${order.total_price.toFixed(2)}</p>
                                 <div className="flex items-center gap-2">
                                     <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)} capitalize`}>{order.status}</span>
                                     {order.status === 'pending' && <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>Accept</Button>}
                                     {order.status === 'preparing' && <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>Ready</Button>}
                                 </div>
                             </div>
                         </div>
                     ))}
                     {activeOrders.length === 0 && <p className="text-muted-foreground text-center py-8">No active orders right now.</p>}
                 </div>
                 <h2 className="text-2xl font-serif font-bold mb-6">Past Orders</h2>
                 <div className="space-y-2">
                    {pastOrders.map(order => (
                        <div key={order.id} className="bg-card/50 border border-border/30 rounded-lg p-3 flex justify-between items-center text-sm">
                            <p>#{order.id.substring(0,8)} - {order.profiles?.full_name}</p>
                            <p className="text-muted-foreground">${order.total_price.toFixed(2)}</p>
                        </div>
                    ))}
                    {pastOrders.length === 0 && <p className="text-muted-foreground text-center py-8">No past orders yet.</p>}
                 </div>
              </div>
            )}
            
            {activeTab === 'messages' && (
                <div className="text-center py-24">
                    <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6"/>
                    <h2 className="text-2xl font-serif font-bold mb-2">Messaging is Coming Soon</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">You'll be able to communicate directly with customers and riders right here.</p>
                </div>
            )}

            {activeTab === 'profile' && (
                <div>
                  <div className="text-center mb-12">
                    <img src={profile?.avatar_url} alt={profile?.full_name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary/20"/>
                    <h2 className="text-3xl font-serif font-bold">{profile?.full_name}</h2>
                    <p className="text-muted-foreground">{profile?.bio}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <button onClick={() => setActiveSettingsSection('personal')} className="group p-6 bg-card rounded-2xl text-left border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
                          <User className="w-6 h-6 mb-3 text-primary"/>
                          <h3 className="font-bold text-lg">Personal Info</h3>
                          <p className="text-sm text-muted-foreground">Update your name and profile picture.</p>
                      </button>
                      <button onClick={() => setActiveSettingsSection('business')} className="group p-6 bg-card rounded-2xl text-left border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
                          <ChefHat className="w-6 h-6 mb-3 text-primary"/>
                          <h3 className="font-bold text-lg">Restaurant Details</h3>
                          <p className="text-sm text-muted-foreground">Manage your kitchen's name and status.</p>
                      </button>