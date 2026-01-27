import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems = [], total = 0, restaurantName = '' } = location.state || {};
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cash'>('card');

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

                {/* Delivery Address */}
                <section className="space-y-3">
                    <h2 className="font-bold text-foreground">Delivery Location</h2>
                    <div className="bg-card p-4 rounded-2xl shadow-sm border border-border/50 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">Gombe State University</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Faculty of Science, Block B</p>
                        </div>
                        <button className="text-xs text-primary font-medium">Change</button>
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
        </div>
    );
};

export default Checkout;
