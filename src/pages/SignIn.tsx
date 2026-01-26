import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ArrowRight, ArrowLeft, Mail, Lock, Bike, ShoppingBag, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = 'customer' | 'chef' | 'rider' | null;

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState<'role' | 'credentials'>('role');
    const [role, setRole] = useState<Role>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const roles = [
        {
            id: 'customer' as Role,
            icon: ShoppingBag,
            title: 'Customer',
            description: 'Sign in to order food',
        },
        {
            id: 'chef' as Role,
            icon: ChefHat,
            title: 'Home Chef',
            description: 'Manage your kitchen',
        },
        {
            id: 'rider' as Role,
            icon: Bike,
            title: 'Delivery Hero',
            description: 'Start your delivery shift',
        },
    ];

    useEffect(() => {
        if (location.state?.role) {
            setRole(location.state.role);
            setStep('credentials');
        }
    }, [location]);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
    };

    const handleContinue = () => {
        if (role) {
            setStep('credentials');
        }
    };

    const handleBack = () => {
        if (step === 'credentials') {
            setStep('role');
            // If we came with a pre-selected role, clearing it might be weird, but allows changing role.
            // We might want to clear location state to key navigation behavior consistent.
        } else {
            navigate('/');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === 'chef') {
            navigate('/chef-dashboard');
        } else if (role === 'rider') {
            navigate('/rider-dashboard');
        } else {
            navigate('/discover');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-background texture-linen flex flex-col justify-center py-12 px-6">
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {step === 'role' ? 'Back to Home' : 'Back to Role Selection'}
                    </button>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                        {step === 'role' ? 'Welcome Back' : `Hello, ${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}`}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {step === 'role' ? 'Choose your account type to continue' : 'Enter your credentials to sign in'}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 'role' ? (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
                                {roles.map((r) => (
                                    <motion.div
                                        key={r.id}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleRoleSelect(r.id)}
                                        className={`relative cursor-pointer p-6 rounded-3xl border-2 transition-all ${role === r.id
                                                ? 'border-primary bg-primary/5 shadow-elevated'
                                                : 'border-border bg-card hover:border-primary/30 shadow-card'
                                            }`}
                                    >
                                        {role === r.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 text-primary-foreground" />
                                            </motion.div>
                                        )}

                                        <div className="w-14 h-14 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <r.icon className="w-7 h-7 text-primary" />
                                        </div>

                                        <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                                            {r.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm font-sans">
                                            {r.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleContinue}
                                    disabled={!role}
                                    className="px-12 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated disabled:opacity-50"
                                >
                                    Continue
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>

                            <div className="text-center mt-8">
                                <p className="text-sm text-muted-foreground">
                                    New to Gombe Eats?{' '}
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        Create Account
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="credentials-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-md mx-auto w-full"
                        >
                            <div className="flex justify-center mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-elevated ${role ? 'bg-primary' : 'bg-primary'}`}>
                                    {role === 'chef' ? <ChefHat className="w-8 h-8" /> :
                                        role === 'rider' ? <Bike className="w-8 h-8" /> :
                                            role === 'customer' ? <ShoppingBag className="w-8 h-8" /> :
                                                <ChefHat className="w-8 h-8" />}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-elevated">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="pl-10 h-12 bg-background border-border"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <button type="button" className="text-xs font-medium text-primary hover:underline">
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                className="pl-10 h-12 bg-background border-border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                                >
                                    Sign In
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SignIn;
