import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Bike, ShoppingBag, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = 'customer' | 'chef' | 'rider' | null;

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const roles = [
    {
      id: 'customer' as Role,
      icon: ShoppingBag,
      title: 'Customer',
      description: 'Order delicious local food from trusted home chefs in your area',
      benefits: ['Access to verified local chefs', 'Loyalty points that never expire', 'Secure escrow payments'],
    },
    {
      id: 'chef' as Role,
      icon: ChefHat,
      title: 'Home Chef',
      description: 'Turn your cooking passion into income from the comfort of your home',
      benefits: ['Set your own menu & prices', 'Flexible working hours', 'Instant payouts'],
    },
    {
      id: 'rider' as Role,
      icon: Bike,
      title: 'Delivery Hero',
      description: 'Earn money delivering food on your own schedule',
      benefits: ['GPS-optimized routes', 'Performance bonuses', 'Customer tips'],
    },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setStep('details');
    }
  };

  const handleBack = () => {
    setStep('role');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to appropriate dashboard based on role
    if (selectedRole === 'chef') {
      navigate('/chef-dashboard');
    } else if (selectedRole === 'rider') {
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
    <div className="min-h-screen bg-background texture-linen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Join Gombe Eats
          </h1>
          <p className="text-lg text-muted-foreground">
            {step === 'role' ? 'Choose how you want to be part of our community' : 'Complete your profile'}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${step === 'role' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
              }`}>
              {step === 'details' ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded-full transition-colors ${step === 'details' ? 'bg-primary' : 'bg-muted'
              }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
              2
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'role' ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Role Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`relative cursor-pointer p-6 rounded-3xl border-2 transition-all ${selectedRole === role.id
                      ? 'border-primary bg-primary/5 shadow-elevated'
                      : 'border-border bg-card hover:border-primary/30 shadow-card'
                      }`}
                  >
                    {/* Selection indicator */}
                    {selectedRole === role.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}

                    <div className="w-14 h-14 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <role.icon className="w-7 h-7 text-primary" />
                    </div>

                    <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-sans">
                      {role.description}
                    </p>

                    <ul className="space-y-2">
                      {role.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <Check className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Continue Button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedRole}
                  className="px-12 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl bg-card shadow-elevated">
                <div className="flex items-center gap-3 pb-6 border-b border-border">
                  {selectedRole && (
                    <>
                      {selectedRole === 'customer' && <ShoppingBag className="w-6 h-6 text-primary" />}
                      {selectedRole === 'chef' && <ChefHat className="w-6 h-6 text-primary" />}
                      {selectedRole === 'rider' && <Bike className="w-6 h-6 text-primary" />}
                    </>
                  )}
                  <span className="font-serif font-semibold text-foreground capitalize">
                    {selectedRole} Registration
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-2 bg-background border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-2 bg-background border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 XXX XXX XXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-2 bg-background border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-foreground">
                      {selectedRole === 'rider' ? 'Current Location' : 'Delivery Address'}
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter your address in Gombe"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="mt-2 bg-background border-border"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-6 border-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/signin', { state: { role: selectedRole } })}
                    className="px-6 py-6 border-2 font-semibold text-primary hover:text-primary/80 hover:bg-primary/5"
                  >
                    Log In
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUp;
