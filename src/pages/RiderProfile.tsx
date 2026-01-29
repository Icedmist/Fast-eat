import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Settings,
    Bell,
    ChevronRight,
    LogOut,
    ArrowLeft,
    Star,
    X,
    Plus,
    DollarSign,
    Package,
    TrendingUp,
    CheckCircle,
    Bike,
    Clock,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const RiderProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(true);

    const stats = {
        todayEarnings: 4200,
        weeklyEarnings: 28500,
        totalDeliveries: 156,
        rating: 4.9,
        cleanStreak: 23,
    };

    const menuItems = [
        { id: 'profile', icon: User, label: 'Edit Profile', subLabel: 'Name, email, phone number', color: 'bg-blue-500' },
        { id: 'online-status', icon: Bike, label: 'Online Status', subLabel: 'Availability and work hours', color: 'bg-green-500' },
        { id: 'earnings', icon: DollarSign, label: 'Earnings', subLabel: 'Today, weekly, payment history', color: 'bg-purple-500' },
        { id: 'stats', icon: Package, label: 'Delivery Stats', subLabel: 'Total deliveries, rating, streak', color: 'bg-orange-500' },
        { id: 'notifications', icon: Bell, label: 'Notifications', subLabel: 'App alerts and delivery requests', color: 'bg-pink-500' },
        { id: 'settings', icon: Settings, label: 'Settings', subLabel: 'Privacy and App Preferences', color: 'bg-gray-500' },
    ];

    const recentDeliveries = [
        {
            id: 'DEL-124',
            restaurant: "Chef Amina's Kitchen",
            date: 'Jan 29, 2026',
            customer: 'Ibrahim Mohammed',
            location: 'Federal Low Cost, Gombe',
            amount: '₦5,700',
            status: 'Delivered',
            duration: '18 min',
        },
        {
            id: 'DEL-123',
            restaurant: 'Yankari Grill',
            date: 'Jan 29, 2026',
            customer: 'Fatima Abubakar',
            location: 'Gombe State University',
            amount: '₦8,200',
            status: 'Delivered',
            duration: '22 min',
        }
    ];

    const renderDrawerContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-3 sm:gap-4 py-2 sm:py-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                                <User className="w-10 h-10 sm:w-12 sm:h-12" />
                                <button className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Change Profile Photo</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Full Name</label>
                                <Input defaultValue="Ahmed Rider" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Email Address</label>
                                <Input defaultValue="ahmed.rider@taste.com" type="email" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Phone Number</label>
                                <Input defaultValue="+234 802 345 6789" type="tel" className="rounded-xl h-12 border-border/50 bg-secondary/30" />
                            </div>
                        </div>
                        <Button className="w-full h-12 sm:h-14 rounded-xl font-bold mt-2 sm:mt-4 shadow-md bg-primary hover:bg-primary/90 text-sm sm:text-base">Save Changes</Button>
                    </div>
                );
            case 'online-status':
                return (
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl ${isOnline ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center text-white`}>
                                        <Bike className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Availability Status</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {isOnline ? 'You are currently online' : 'You are currently offline'}
                                        </p>
                                    </div>
                                </div>
                                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Online since 8:30 AM today</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Quick Stats</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">Today's Deliveries</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.todayEarnings / 525}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">Hours Online</p>
                                    <p className="text-2xl font-bold text-foreground">5.2h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'earnings':
                return (
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground font-medium">Today's Earnings</p>
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                            <h3 className="text-4xl font-bold font-serif text-foreground mb-1">₦{stats.todayEarnings.toLocaleString()}</h3>
                            <p className="text-xs text-green-600 font-medium">+12% from yesterday</p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">This Week</h4>
                            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Weekly Total</p>
                                        <p className="text-2xl font-bold text-foreground">₦{stats.weeklyEarnings.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground mb-1">Avg per day</p>
                                        <p className="text-lg font-bold text-primary">₦{Math.round(stats.weeklyEarnings / 7).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Payment History</h4>
                            <div className="space-y-2">
                                {[
                                    { date: 'Jan 22, 2026', amount: 28500, status: 'Paid' },
                                    { date: 'Jan 15, 2026', amount: 31200, status: 'Paid' },
                                ].map((payment, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-secondary/20 border border-border/30 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-foreground">₦{payment.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                                        </div>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{payment.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'stats':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                                <Package className="w-6 h-6 text-orange-600 mb-2" />
                                <p className="text-xs text-muted-foreground mb-1">Total Deliveries</p>
                                <p className="text-2xl font-bold text-foreground">{stats.totalDeliveries}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                <Star className="w-6 h-6 text-amber-500 mb-2" />
                                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                                <p className="text-2xl font-bold text-foreground">{stats.rating}</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Clean Delivery Streak</p>
                                    <p className="text-3xl font-bold font-serif text-foreground">{stats.cleanStreak}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Keep up the great work! No issues or complaints.</p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Performance</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20">
                                    <span className="text-sm text-foreground">On-time Delivery Rate</span>
                                    <span className="text-sm font-bold text-green-600">98%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20">
                                    <span className="text-sm text-foreground">Avg Delivery Time</span>
                                    <span className="text-sm font-bold text-primary">18 min</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20">
                                    <span className="text-sm text-foreground">Customer Satisfaction</span>
                                    <span className="text-sm font-bold text-amber-500">4.9/5.0</span>
                                </div>
                            </div>
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
                className="px-5 pt-8 sm:pt-12 pb-5 bg-white shadow-sm sticky top-0 z-40 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/rider-dashboard')}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-xl font-serif font-bold">Rider Profile</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Settings className="w-6 h-6 text-muted-foreground" />
                </button>
            </motion.header>

            <div className="max-w-5xl mx-auto px-5 pt-8 pb-24 space-y-8">
                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card rounded-3xl p-4 sm:p-6 shadow-card flex items-center gap-4 sm:gap-5 border border-border/50"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative shrink-0">
                        <Bike className="w-8 h-8 sm:w-10 sm:h-10" />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white rounded-full`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold font-serif underline decoration-primary/30 truncate">Ahmed Rider</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">ahmed.rider@taste.com</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-orange-500" />
                                <span>{stats.rating}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('profile')}
                        className="p-2 sm:p-3 h-auto rounded-xl hover:bg-secondary text-primary font-bold text-[10px] sm:text-xs"
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
                                className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 hover:bg-secondary/50 transition-colors border-b last:border-0 border-border/30 group"
                            >
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm transition-transform group-active:scale-90 shrink-0`}>
                                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
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

                {/* Recent Deliveries */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between pl-1">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recent Deliveries</h3>
                        <button className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentDeliveries.map((delivery, idx) => (
                            <motion.div
                                key={delivery.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-card rounded-2xl p-3 sm:p-4 shadow-card border border-border/50 hover:border-primary/30 transition-colors group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-xs sm:text-sm text-foreground">{delivery.restaurant}</h4>
                                            <span className="text-[9px] sm:text-[10px] font-bold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full">{delivery.status}</span>
                                        </div>
                                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">{delivery.date} • {delivery.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{delivery.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-primary">{delivery.amount}</span>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>{delivery.duration}</span>
                                        </div>
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

                <p className="text-center text-[10px] text-muted-foreground pb-10">Taste Explorer Rider v1.2.4 (2026 Edition)</p>
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
                            className="fixed bottom-0 left-0 right-0 max-w-5xl mx-auto bg-card rounded-t-[40px] z-[60] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
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

export default RiderProfile;
