import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    ShoppingBag,
    MapPin,
    CreditCard,
    Bell,
    ChevronRight,
    LogOut,
    ArrowLeft,
    Heart,
    Star,
    X,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const menuItems = [
        { id: 'profile', icon: User, label: 'Edit Profile', subLabel: 'Username, email, bio', color: 'bg-blue-500' },
        { id: 'addresses', icon: MapPin, label: 'Saved Addresses', subLabel: 'Home, Office, Other', color: 'bg-green-500' },
        { id: 'payment', icon: CreditCard, label: 'Payment Methods', subLabel: 'Cards, Wallet, Pay on Delivery', color: 'bg-purple-500' },
        { id: 'favorites', icon: Heart, label: 'Favorites', subLabel: 'Restaurants and Dishes', color: 'bg-pink-500' },
        { id: 'notifications', icon: Bell, label: 'Notifications', subLabel: 'App alerts and offers', color: 'bg-orange-500' },
        { id: 'settings', icon: Settings, label: 'Settings', subLabel: 'Privacy and App Preferences', color: 'bg-gray-500' },
    ];

    const recentOrders = [
        {
            id: 'ord-124',
            restaurant: 'Masa Spot Gombe',
            date: 'Dec 12, 2025',
            items: '2x Classic Masa, 1x Zobo',
            total: '₦3,500',
            status: 'Delivered',
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop'
        },
        {
            id: 'ord-125',
            restaurant: 'Yankari Grill',
            date: 'Dec 10, 2025',
            items: '1x Grilled Fish, 1x Fried Plantain',
            total: '₦7,200',
            status: 'Delivered',
            image: 'https://images.unsplash.com/photo-1589182893770-99f2369c5136?q=80&w=1974&auto=format&fit=crop'
        }
    ];

    const renderDrawerContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                                <User className="w-12 h-12" />
                                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Change Profile Photo</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Full Name</label>
                                <Input defaultValue="Abdul Maaji" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Email Address</label>
                                <Input defaultValue="abdul.maaji@taste.com" type="email" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Phone Number</label>
                                <Input defaultValue="+234 801 234 5678" type="tel" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                        </div>
                        <Button className="w-full h-12 rounded-xl font-bold mt-4 shadow-md bg-primary hover:bg-primary/90">Save Changes</Button>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Home</p>
                                        <p className="text-xs text-muted-foreground">123 Market Road, Gombe</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary px-2">Edit</Button>
                            </div>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm">Add New Address</span>
                            </Button>
                        </div>
                    </div>
                );
            case 'payment':
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#333] text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CreditCard className="w-24 h-24" />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-6 bg-white/20 rounded-md" />
                                    <span className="text-xs font-bold opacity-70 italic tracking-widest uppercase">MASTERCARD</span>
                                </div>
                                <p className="text-lg font-mono tracking-[0.2em] mb-4">**** **** **** 4242</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Card Holder</p>
                                        <p className="text-sm font-medium tracking-wider">ABDUL MAAJI</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest">Expires</p>
                                        <p className="text-sm font-medium">12/28</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm">Add New Card</span>
                            </Button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="py-20 text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto text-muted-foreground/30">
                            <Settings className="w-8 h-8" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">This section is being updated</p>
                        <Button variant="outline" onClick={() => setActiveTab(null)} className="rounded-xl text-xs font-bold">Go Back</Button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] overflow-x-hidden">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-40 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-xl font-serif font-bold">Profile</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Settings className="w-6 h-6 text-muted-foreground" />
                </button>
            </motion.header>

            <div className="max-w-2xl mx-auto px-5 pt-8 pb-24 space-y-8">
                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-3xl p-6 shadow-card flex items-center gap-5 border border-border/50"
                >
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                        <User className="w-10 h-10" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold font-serif underline decoration-primary/30">Abdul Maaji</h2>
                        <p className="text-sm text-muted-foreground">abdul.maaji@taste.com</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold tracking-wider uppercase">
                                Premium Member
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-orange-500" />
                                <span>Level 4</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('profile')}
                        className="p-3 h-auto rounded-xl hover:bg-secondary text-primary font-bold text-xs"
                    >
                        Edit
                    </Button>
                </motion.div>

                {/* Action Menu */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">My Account</h3>
                    <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50">
                        {menuItems.map((item, idx) => (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setActiveTab(item.id)}
                                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b last:border-0 border-border/30 group"
                            >
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm transition-transform group-active:scale-90`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-sm text-foreground">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.subLabel}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-40 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Recent Orders */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recent Orders</h3>
                        <button className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-card rounded-2xl p-4 shadow-card border border-border/50 flex gap-4 hover:border-primary/30 transition-colors group cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                                    <img src={order.image} alt={order.restaurant} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-foreground truncate">{order.restaurant}</h4>
                                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{order.status}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{order.date} • {order.id}</p>
                                    <p className="text-xs text-foreground mt-1 line-clamp-1 italic text-muted-foreground">"{order.items}"</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-bold text-primary">{order.total}</span>
                                        <button className="text-[10px] font-bold text-primary px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/5">Reorder</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Logout */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors shadow-sm active:scale-95"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </motion.button>

                <p className="text-center text-[10px] text-muted-foreground pb-10">Taste Explorer v1.2.4 (2026 Edition)</p>
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {activeTab && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveTab(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-card rounded-t-[40px] z-[60] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
                        >
                            <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto mt-4 mb-2 opacity-50 shrink-0" />
                            <div className="px-6 py-4 border-b border-border/30 flex justify-between items-center shrink-0">
                                <h3 className="text-xl font-bold font-serif">
                                    {menuItems.find(i => i.id === activeTab)?.label || 'Details'}
                                </h3>
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                                {renderDrawerContent()}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
