import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    ChevronRight,
    LogOut,
    ArrowLeft,
    Heart,
    X,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/signin');
                return;
            }

            try {
                const [
                    profileRes,
                    favoritesRes,
                    ordersRes
                ] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', user.id).single(),
                    supabase.from('user_favorites').select('restaurants!inner(id, name, image_url, description)').eq('user_id', user.id),
                    supabase.from('orders').select('*, restaurants(name), order_items(quantity, dishes(name, image_url))').eq('customer_id', user.id).order('created_at', { ascending: false }).limit(5)
                ]);

                if (profileRes.data) {
                    setUserProfile(profileRes.data);
                    setFullName(profileRes.data.full_name || '');
                    setPhoneNumber(profileRes.data.phone_number || '');
                }

                if (favoritesRes.data) {
                    setFavoriteRestaurants(favoritesRes.data.map((fav: any) => fav.restaurants).filter(Boolean));
                }

                if (ordersRes.data) {
                    setRecentOrders(ordersRes.data);
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleUpdateProfile = async () => {
        if (!userProfile) return;
        const { error } = await supabase.from('profiles').update({ full_name: fullName, phone_number: phoneNumber }).eq('id', userProfile.id);
        if (error) {
            alert('Error updating profile: ' + error.message);
        } else {
            alert('Profile updated successfully!');
            setUserProfile({ ...userProfile, full_name: fullName, phone_number: phoneNumber });
            setActiveTab(null);
        }
    };

    const handleUnfavorite = async (restaurantId: string) => {
        if (!userProfile) return;
        const { error } = await supabase.from('user_favorites').delete().match({ user_id: userProfile.id, restaurant_id: restaurantId });
        if (error) {
            alert('Error removing favorite: ' + error.message);
        } else {
            setFavoriteRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        }
    };

    const menuItems = [
        { id: 'profile', icon: User, label: 'Edit Profile', color: 'bg-blue-500' },
        { id: 'favorites', icon: Heart, label: 'Favorites', color: 'bg-pink-500' },
    ];

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">Loading Profile...</p>
            </div>
        );
    }

    const renderDrawerContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6 pt-4">
                        <div className="space-y-4">
                             <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Full Name</label>
                                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-12" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Email Address</label>
                                <Input value={userProfile?.email || ''} type="email" disabled className="rounded-xl h-12" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold pl-1">Phone Number</label>
                                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="tel" className="rounded-xl h-12" />
                            </div>
                        </div>
                        <Button onClick={handleUpdateProfile} className="w-full h-12 font-bold">Save Changes</Button>
                    </div>
                );
            case 'favorites':
                return (
                    <div className="space-y-4 pt-4">
                        {favoriteRestaurants.length === 0 ? (
                            <p className='text-center text-muted-foreground'>You haven't favorited any restaurants yet.</p>
                        ) : (
                            favoriteRestaurants.map((restaurant) => (
                                <div key={restaurant?.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={restaurant?.image_url} alt={restaurant?.name} className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                                        <div className='max-w-xs'>
                                            <h4 className="font-bold truncate">{restaurant?.name}</h4>
                                            <p className="text-sm text-muted-foreground truncate">{restaurant?.description}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleUnfavorite(restaurant.id)}>Remove</Button>
                                </div>
                            ))
                        )}
                    </div>
                );
            default:
                return <p className='text-center text-muted-foreground pt-4'>This section is under construction.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            <header className="px-5 pt-8 pb-5 bg-white shadow-sm sticky top-0 z-30 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-serif font-bold">Profile</h1>
                <div className='w-8'></div>
            </header>

            <main className="max-w-5xl mx-auto px-5 pt-8 pb-24 space-y-8">
                <section className="bg-card rounded-3xl p-6 shadow-card flex items-center gap-5 border border-border/50">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <User className="w-10 h-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold font-serif truncate">{userProfile?.full_name || 'User Name'}</h2>
                        <p className="text-sm text-muted-foreground truncate">{userProfile?.email || 'user@email.com'}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('profile')} >Edit</Button>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">My Account</h3>
                    <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50">
                        {menuItems.map((item) => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 border-b last:border-0">
                                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shrink-0`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-sm">{item.label}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Recent Orders</h3>
                    <div className="space-y-3">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{order.restaurants?.name || 'Restaurant unavailable'}</h4>
                                        <span className="text-sm font-bold text-primary">${order.total_price}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                    <div className="mt-2 pt-2 border-t">
                                        {order.order_items?.map((item: any, index: number) => (
                                            <p key={index} className="text-sm text-muted-foreground">{item.quantity}x {item.dishes?.name || 'Dish unavailable'}</p>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-center py-8'><p className="text-muted-foreground">You have no recent orders.</p></div>
                        )}
                    </div>
                </section>

                <motion.button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        navigate('/');
                    }}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </motion.button>
            </main>

            <AnimatePresence>
                {activeTab && (
                    <motion.div className='fixed inset-0 z-50'>
                        <motion.div onClick={() => setActiveTab(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto bg-card rounded-t-[40px] z-10 p-6 flex flex-col max-h-[80dvh]"
                        >
                             <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto -mt-2 mb-2" />
                            <h3 className="text-xl font-bold font-serif">{menuItems.find(i => i.id === activeTab)?.label}</h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {renderDrawerContent()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
