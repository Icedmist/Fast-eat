import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bike, 
  Navigation, 
  Phone, 
  MapPin, 
  Clock,
  DollarSign,
  Star,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DeliveryOrder {
  id: string;
  status: 'pickup' | 'delivering' | 'completed';
  chef: {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
  };
  customer: {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
  };
  items: string[];
  total: number;
  tip: number;
  estimatedTime: string;
}

const RiderDashboard = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder | null>({
    id: 'DEL001',
    status: 'pickup',
    chef: {
      name: "Chef Amina's Kitchen",
      address: '15 Bauchi Road, Gombe',
      phone: '+234 812 345 6789',
      lat: 10.2897,
      lng: 11.1673,
    },
    customer: {
      name: 'Ibrahim Mohammed',
      address: '42 Federal Low Cost, Gombe',
      phone: '+234 809 876 5432',
      lat: 10.2950,
      lng: 11.1720,
    },
    items: ['Masa x5', 'Kilishi (200g)', 'Miyan Kuka x2'],
    total: 5500,
    tip: 200,
    estimatedTime: '12 min',
  });

  const stats = {
    todayDeliveries: 8,
    todayEarnings: 4200,
    rating: 4.9,
    cleanDeliveryStreak: 23,
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [10.2897, 11.1673],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Chef marker (pickup)
    if (currentOrder) {
      const chefIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: hsl(16 65% 50%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L13.09 8.26L22 9.27L17 14L18.18 22L12 18L5.82 22L7 14L2 9.27L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([currentOrder.chef.lat, currentOrder.chef.lng], { icon: chefIcon }).addTo(map);

      // Customer marker
      const customerIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: #10b981;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([currentOrder.customer.lat, currentOrder.customer.lng], { icon: customerIcon }).addTo(map);

      // Draw route line
      const routeCoords: [number, number][] = [
        [currentOrder.chef.lat, currentOrder.chef.lng],
        [currentOrder.customer.lat, currentOrder.customer.lng],
      ];
      
      L.polyline(routeCoords, {
        color: 'hsl(16 65% 50%)',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map);

      // Fit bounds
      map.fitBounds(routeCoords, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentOrder]);

  const handlePickupComplete = () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'delivering' });
    }
  };

  const handleDeliveryComplete = () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status: 'completed' });
    }
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-background">
      {/* Map */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-40 px-4 pt-12 pb-4"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl glass shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bike className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery Hero</p>
              <h1 className="font-serif font-bold text-foreground">Ahmed Rider</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium text-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>
      </motion.header>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-36 right-4 z-40 flex flex-col gap-3"
      >
        <div className="p-3 rounded-xl glass shadow-card flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{stats.todayDeliveries}</span>
        </div>
        <div className="p-3 rounded-xl glass shadow-card flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-foreground">₦{stats.todayEarnings.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl glass shadow-card flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-foreground">{stats.rating}</span>
        </div>
      </motion.div>

      {/* Clean Delivery Streak */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-36 left-4 z-40"
      >
        <div className="p-4 rounded-xl glass shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Clean Streak</span>
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{stats.cleanDeliveryStreak}</p>
        </div>
      </motion.div>

      {/* Bottom Order Panel */}
      {currentOrder && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-elevated"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-muted" />
          </div>

          <div className="px-5 pb-8">
            {/* Order Status */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order #{currentOrder.id}</p>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {currentOrder.status === 'pickup' ? 'Pickup from Chef' : 
                   currentOrder.status === 'delivering' ? 'Delivering to Customer' : 'Completed'}
                </h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{currentOrder.estimatedTime}</span>
              </div>
            </div>

            {/* Current Destination */}
            <div className="p-4 rounded-2xl bg-secondary mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentOrder.status === 'pickup' ? 'bg-primary/10' : 'bg-green-100'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    currentOrder.status === 'pickup' ? 'text-primary' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {currentOrder.status === 'pickup' ? currentOrder.chef.name : currentOrder.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentOrder.status === 'pickup' ? currentOrder.chef.address : currentOrder.customer.address}
                  </p>
                </div>
                <a
                  href={`tel:${currentOrder.status === 'pickup' ? currentOrder.chef.phone : currentOrder.customer.phone}`}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Order Items</p>
              <p className="text-foreground">{currentOrder.items.join(' • ')}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-semibold text-foreground">₦{currentOrder.total.toLocaleString()}</span>
                {currentOrder.tip > 0 && (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    +₦{currentOrder.tip} tip
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-6 border-2"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>

              {currentOrder.status === 'pickup' ? (
                <Button
                  onClick={handlePickupComplete}
                  className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Picked Up
                </Button>
              ) : currentOrder.status === 'delivering' ? (
                <Button
                  onClick={handleDeliveryComplete}
                  className="flex-1 py-6 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Delivered
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentOrder(null)}
                  className="flex-1 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Find New Order
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* No Order State */}
      {!currentOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-30 bg-background/50"
        >
          <div className="text-center p-8 rounded-3xl bg-card shadow-elevated max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bike className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">Ready for Orders</h2>
            <p className="text-muted-foreground mb-6">
              You're online and waiting for new delivery requests
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Average wait: 2 min</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RiderDashboard;
