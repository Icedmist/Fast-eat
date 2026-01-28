import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle, Clock, ChevronRight, Navigation2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems = [], total = 0, restaurantName = '' } = location.state || {};
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cash'>('card');
    const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState({
        id: '1',
        type: 'Home',
        address: 'Gombe State University',
        sub: 'Faculty of Science, Block B'
    });

    const savedAddresses = [
        { id: '1', type: 'Home', address: 'Gombe State University', sub: 'Faculty of Science, Block B' },
        { id: '2', type: 'Office', address: 'NNPC Plaza', sub: 'Floor 3, Room 302' },
        { id: '3', type: 'School', address: 'Federal University Gombe', sub: 'Hostel A, Room 12' }
    ];

    if (!location.state || orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <p className="text-muted-foreground mb-4">No order details found.</p>
                <Button onClick={() => navigate('/discover')}>Go to Discover</Button>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        // Simulate API call
        setTimeout(() => {
            setStep('success');
        }, 1500);
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-10 h-10" />
                </motion.div>
                <h2 className="text-2xl font-bold font-serif mb-2">Order Placed!</h2>
                <p className="text-muted-foreground mb-8">
                    Your order from {restaurantName} has been received and is being processed.
                </p>
                <Button onClick={() => navigate('/discover')} className="w-full max-w-xs rounded-xl h-12">
                    Back to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-5 py-4 border-b border-border/50 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold">Checkout</h1>
            </div>

            <div className="max-w-xl mx-auto px-5 py-6 space-y-6">

                {/* Delivery Address & Map Preview */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="font-bold text-foreground">Delivery Location</h2>
                        <button
                            onClick={() => setIsAddressDrawerOpen(true)}
                            className="text-xs text-primary font-bold hover:underline"
                        >
                            Change
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-card p-4 rounded-3xl shadow-soft border border-border/50 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    {selectedAddress.type}
                                </h3>
                                <p className="text-xs font-bold text-foreground truncate">{selectedAddress.address}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{selectedAddress.sub}</p>
                            </div>
                        </div>

                        {/* Map Preview (Customer Only) */}
                        <div className="relative h-48 w-full rounded-[2.5rem] overflow-hidden bg-secondary/20 border border-border/50 group">
                            {/* Mock Map Background */}
                            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=10.2897,11.1673&zoom=15&size=600x300&scale=2&key=YOUR_API_KEY_MOCK')] bg-cover bg-center opacity-60 grayscale-[0.5] group-hover:scale-105 transition-transform duration-1000" />

                            {/* Map Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

                            {/* Custom Location Tag */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-[3]" />
                                    <div className="relative bg-primary text-white p-2.5 rounded-2xl shadow-elevated flex items-center gap-2 border-2 border-white">
                                        <Navigation2 className="w-3.5 h-3.5 fill-current rotate-45" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Your Spot</span>
                                    </div>
                                    {/* Stem */}
                                    <div className="w-1 h-3 bg-white mx-auto -mt-0.5 rounded-full" />
                                </div>
                            </motion.div>

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm text-foreground border border-white/20">
                                    Within 1.2km of Vendor
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Summary */}
                <section className="space-y-3">
                    <h2 className="font-bold text-foreground">Order Summary</h2>
                    <div className="bg-card p-5 rounded-2xl shadow-sm border border-border/50 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Prep time: 20-30 min</span>
                        </div>

                        {orderItems.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex gap-2 items-start">
                                    <span className="text-sm font-medium bg-secondary w-5 h-5 flex items-center justify-center rounded text-xs">{item.quantity}x</span>
                                    <span className="text-sm text-foreground">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}

                        <div className="border-t border-dashed border-border my-4 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span>₦500</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Service Fee</span>
                                <span>₦100</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-3 flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg text-primary">₦{(total + 600).toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Payment Method */}
                <section className="space-y-3">
                    <h2 className="font-bold text-foreground">Payment Method</h2>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'card'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-xs font-medium">Card</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('bank')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'bank'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">₦</div>
                            <span className="text-xs font-medium">Transfer</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-colors ${paymentMethod === 'cash'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border bg-card text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            <Banknote className="w-6 h-6" />
                            <span className="text-xs font-medium">Cash</span>
                        </button>
                    </div>
                </section>

            </div>

            {/* Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md p-5 border-t border-border z-40">
                <Button
                    onClick={handlePlaceOrder}
                    className="w-full h-12 text-base font-bold rounded-xl shadow-md max-w-xl mx-auto block"
                >
                    Place Order - ₦{(total + 600).toLocaleString()}
                </Button>
            </div>
            {/* Address Selection Drawer */}
            <AnimatePresence>
                {isAddressDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddressDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-card rounded-t-[40px] z-[101] overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto mt-4 mb-2 opacity-50 shrink-0" />
                            <div className="px-6 py-4 border-b border-border/30 flex justify-between items-center shrink-0">
                                <h3 className="text-xl font-bold font-serif text-foreground">Select Address</h3>
                                <button
                                    onClick={() => setIsAddressDrawerOpen(false)}
                                    className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-3">
                                {savedAddresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setIsAddressDrawerOpen(false);
                                        }}
                                        className={`w-full p-4 rounded-3xl border text-left transition-all ${selectedAddress.id === addr.id
                                                ? 'border-primary bg-primary/5 shadow-soft'
                                                : 'border-border/50 bg-secondary/10 hover:border-primary/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedAddress.id === addr.id ? 'bg-primary text-white' : 'bg-card text-muted-foreground shadow-sm'
                                                }`}>
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-foreground">{addr.type}</h4>
                                                <p className="text-xs font-bold text-foreground truncate">{addr.address}</p>
                                                <p className="text-[11px] text-muted-foreground truncate">{addr.sub}</p>
                                            </div>
                                            {selectedAddress.id === addr.id && (
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
