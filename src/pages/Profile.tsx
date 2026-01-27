import { motion } from 'framer-motion';
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
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Profile = () => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: User, label: 'Edit Profile', subLabel: 'Username, email, bio', color: 'bg-blue-500' },
        { icon: MapPin, label: 'Saved Addresses', subLabel: 'Home, Office, Other', color: 'bg-green-500' },
        { icon: CreditCard, label: 'Payment Methods', subLabel: 'Cards, Wallet, Pay on Delivery', color: 'bg-purple-500' },
        { icon: Heart, label: 'Favorites', subLabel: 'Restaurants and Dishes', color: 'bg-pink-500' },
        { icon: Bell, label: 'Notifications', subLabel: 'App alerts and offers', color: 'bg-orange-500' },
        { icon: Settings, label: 'Settings', subLabel: 'Privacy and App Preferences', color: 'bg-gray-500' },
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

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-30 flex items-center justify-between"
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
                            <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                                <Star className="w-3 h-3 fill-orange-500" />
                                <span>Level 4</span>
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30" />
                </motion.div>

                {/* Action Menu */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">My Account</h3>
                    <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50">
                        {menuItems.map((item, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b last:border-0 border-border/30"
                            >
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-sm text-foreground">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.subLabel}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-40" />
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
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors shadow-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </motion.button>

                <p className="text-center text-[10px] text-muted-foreground">Taste Explorer v1.2.4 (2026 Edition)</p>
            </div>
        </div>
    );
};

export default Profile;
