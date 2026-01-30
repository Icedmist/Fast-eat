import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight, ChefHat, Bike, ShoppingBag,
  Star, MapPin, Shield, Lock, Sparkles,
  CheckCircle2, Quote, Instagram, MessageSquare, Twitter,
  Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Trust', id: 'trust' },
    { name: 'Journey', id: 'journey' },
    { name: 'Impact', id: 'impact' },
    { name: 'Stories', id: 'stories' },
  ];

  const feedBacks = [
    {
      name: 'Aisha Lawal',
      role: 'Regular Customer',
      content: 'The Masa I ordered was just like my grandmother used to make. Authentic and fresh!',
      stars: 5,
    },
    {
      name: 'Musa Ibrahim',
      role: 'Food Enthusiast',
      content: 'I love how I can support local chefs in Gombe directly. The delivery was incredibly fast.',
      stars: 5,
    },
    {
      name: 'Fatima Zubairu',
      role: 'Student',
      content: 'Authentic flavors at a great price. Fast Eat is a game-changer for Gombe!',
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background texture-linen">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-4 ${isScrolled ? 'pt-2' : 'pt-6'}`}>
        <div className={`container mx-auto max-w-5xl rounded-full transition-all duration-500 border relative overflow-hidden ${isScrolled ? 'bg-white/70 backdrop-blur-md border-white/20 shadow-lg py-2 px-6 sm:px-8' : 'bg-transparent border-transparent py-4 px-4 sm:px-6'}`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft">
                <img src="/logo.svg" alt="Fast Eat Logo" className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight hidden sm:block">Fast Eat</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-black/5 rounded-full p-1 border border-black/5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-5 py-2 text-sm font-medium rounded-full hover:bg-white hover:shadow-soft transition-all text-muted-foreground hover:text-foreground"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <span className="hidden lg:block text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('/signin')}>Sign In</span>
              <Button
                onClick={() => navigate('/signup')}
                className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 shadow-md hover:shadow-xl transition-all"
              >
                Start <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Progress bar inside the container */}
          <motion.div
            className="h-1 bg-primary absolute bottom-0 left-0 right-0 origin-left"
            style={{ scaleX, opacity: isScrolled ? 1 : 0 }}
          />
        </div>
      </nav>

      {/* Section 0: The Heart of Gombe (Intro) */}
      <section id="intro" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FBF9F6]">
        {/* Decorative elements based on user image */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 md:w-96 opacity-10 pointer-events-none">
          <img src="/src/assets/images/spread.png" alt="" className="w-full rotate-45 scale-110" />
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 md:w-96 opacity-10 pointer-events-none">
          <img src="/src/assets/images/spread.png" alt="" className="w-full -rotate-45 scale-110" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium bg-[#E67E22]/10 text-[#E67E22] rounded-full border border-[#E67E22]/20">
              <Sparkles className="w-4 h-4" /> Gombe's Premier Food Marketplace
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-6 sm:mb-8 tracking-tight">
              Taste the <br />
              <span className="text-primary italic">Heart of Gombe</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
              Connect with trusted home chefs in your neighborhood. <br className="hidden md:block" />
              Authentic local delicacies, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="group text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated rounded-2xl"
              >
                Join the Community
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('trust')}
                className="text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 border-2 border-primary/20 hover:bg-primary/5 rounded-2xl bg-white/50 backdrop-blur-sm"
              >
                Explore Food
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          onClick={() => scrollToSection('hero')}
        >
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-current rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Hero Section (Section 1) */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/masa.png"
            alt="Masa Delicacy"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                🍲 Fast Eat
              </span>

              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight mb-6">
                From <span className="text-primary italic">Invisible</span> to <span className="text-primary italic">Invincible</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl font-sans">
                We bring Gombe's hidden home chefs into the light.
                Experience authentic home-cooked meals while empowering your local community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated"
                >
                  Join the Community
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/discover')}
                  className="text-lg px-8 py-6 border-2 border-primary/20 hover:bg-primary/5"
                >
                  Discover Flavors
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/src/assets/images/masa.png"
                  alt="Traditional Masa"
                  className="w-full aspect-square object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: The Circle of Trust */}
      <section id="trust" className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              The Circle of Trust
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our community is built on integrity. We connect passionate chefs, reliable riders, and
              happy customers in a seamless partnership of trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chefs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 rounded-[2.5rem] bg-[#FFF8F4] border border-primary/10 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <ChefHat className="w-7 h-7 text-[#E67E22]" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Chefs: The Heart</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cooking with passion and integrity. Every chef is verified and signs our quality promise.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#E67E22]">
                <Shield className="w-4 h-4 mr-2" />
                Verified Kitchens
              </div>
            </motion.div>

            {/* Riders Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-[#F4F9FF] border border-blue-100 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Bike className="w-7 h-7 text-[#3498DB]" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Riders: The Pulse</h3>
              <p className="text-muted-foreground leading-relaxed">
                Delivering with care and speed. Real-time tracking and professional handling of every order.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#3498DB]">
                <MapPin className="w-4 h-4 mr-2" />
                Neighborhood Coverage
              </div>
            </motion.div>

            {/* Customers Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group p-8 rounded-[2.5rem] bg-[#F9F4FF] border border-purple-100 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-7 h-7 text-[#8E44AD]" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Customers: The Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Eat well and empower the community. Your reviews help maintain our high standards.
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-[#8E44AD]">
                <Star className="w-4 h-4 mr-2" />
                Community Driven
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: The Step-by-Step Journey */}
      <section id="journey" className="py-16 sm:py-24 bg-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Your Journey to Authentic Taste
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              How we bring Gombe's finest flavors to your doorstep.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Discover',
                description: "Open the map to find Gombe's hidden home kitchens nearby.",
              },
              {
                icon: Lock,
                title: 'Locked Security',
                description: "Your payment stays safe in escrow until you're satisfied with your meal.",
              },
              {
                icon: Sparkles,
                title: 'Authentic Delivery',
                description: 'Enjoy home-cooked meals at your door within minutes, hot and fresh.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-3xl bg-card shadow-card group hover:shadow-elevated transition-all"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Impact & Stats */}
      <section id="impact" className="py-16 sm:py-24 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Home-based Vendors', value: '200+', icon: CheckCircle2 },
              { label: 'Verified Hygiene', value: '100%', icon: Shield },
              { label: 'Rider Dispatch', value: '5-Min', icon: Bike },
              { label: 'Cashback Points', value: '5%', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/5">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Success Stories */}
      <section id="stories" className="py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Community Voices
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Real stories from our happy customers and chefs in Gombe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {feedBacks.map((feedback, index) => (
              <motion.div
                key={feedback.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm relative"
              >
                <Quote className="absolute top-6 right-8 w-10 h-10 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(feedback.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg text-foreground mb-6 font-serif italic">
                  "{feedback.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {feedback.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{feedback.name}</h4>
                    <p className="text-sm text-muted-foreground">{feedback.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer: The Trust Anchor */}
      <footer className="bg-[#1A1A1A] text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            {/* Column 1: Legal & Safety */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Legal & Safety
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Integrity Contract</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors font-medium text-white/90 underline decoration-primary underline-offset-4">How we Verify Kitchens</a></li>
              </ul>
              <p className="mt-6 text-sm text-gray-500 italic">
                Our Brand Ambassadors personally inspect every kitchen in Gombe to ensure the highest standards.
              </p>
            </div>

            {/* Column 2: Community & Social Proof */}
            <div>
              <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Community
              </h3>
              <ul className="space-y-4 text-gray-400 mb-8">
                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" onClick={() => navigate('/signup')}>Join the Community</a></li>
              </ul>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors group">
                  <Instagram className="w-5 h-5 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors group">
                  <MessageSquare className="w-5 h-5 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors group">
                  <Twitter className="w-5 h-5 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Column 3: Support Hub */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-serif font-bold mb-6">Support Hub</h3>
              <p className="text-gray-400 mb-6">
                Need localized assistance? Our Gombe neighborhood Brand Ambassadors are here to help.
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-4">
                Talk to a Human
              </Button>
              <div className="text-sm text-gray-500 text-center">
                Vendor Support & Customer Care
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© 2026 Fast Eat. Empowering Gombe's Home Kitchens.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
