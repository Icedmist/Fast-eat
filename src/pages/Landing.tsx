import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Bike, ShoppingBag, Star, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Trusted Chefs',
      description: 'Every home chef signs our integrity contract',
    },
    {
      icon: MapPin,
      title: 'Local Flavors',
      description: 'Authentic Gombe cuisine from your neighborhood',
    },
    {
      icon: Star,
      title: 'Quality First',
      description: 'Real reviews from real customers',
    },
  ];

  const delicacies = [
    {
      name: 'Masa',
      description: 'Fluffy rice cakes',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
    },
    {
      name: 'Kilishi',
      description: 'Spiced dried meat',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    },
    {
      name: 'Tuwo Shinkafa',
      description: 'Traditional rice pudding',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background texture-linen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
            alt="Gombe delicacies"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                🍲 Gombe's Premier Food Marketplace
              </span>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight mb-6">
                Taste the
                <span className="block text-primary">Heart of Gombe</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-sans">
                Connect with trusted home chefs in your neighborhood. 
                Authentic local delicacies, delivered to your door.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
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
                  Explore Food
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Delicacies Showcase */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Local Favorites
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Discover the rich flavors of Northern Nigerian cuisine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {delicacies.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-elevated"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-card">
                  <h3 className="text-2xl font-serif font-bold mb-1">{item.name}</h3>
                  <p className="text-card/80 font-sans">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-sans">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles CTA */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              How Will You Join?
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Choose your role in the Gombe food community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: ShoppingBag,
                role: 'Customer',
                description: 'Order authentic local food from trusted home chefs',
                color: 'bg-primary',
              },
              {
                icon: ChefHat,
                role: 'Home Chef',
                description: 'Share your culinary skills and earn from home',
                color: 'bg-accent-foreground',
              },
              {
                icon: Bike,
                role: 'Delivery Hero',
                description: 'Deliver happiness and earn on your schedule',
                color: 'bg-muted-foreground',
              },
            ].map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate('/signup')}
                className="group cursor-pointer p-8 rounded-3xl bg-card shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className={`w-16 h-16 mb-6 rounded-2xl ${item.color}/10 flex items-center justify-center`}>
                  <item.icon className={`w-8 h-8 text-primary`} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                  {item.role}
                </h3>
                <p className="text-muted-foreground font-sans mb-4">
                  {item.description}
                </p>
                <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
            Gombe Eats
          </h3>
          <p className="text-muted-foreground font-sans">
            Connecting communities through food
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
