import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/data/restaurants';
import { Button } from './ui/button';
import { Minimize2 } from 'lucide-react';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  isFullScreen: boolean;
  onExitFullScreen: () => void;
}

// Add type definition for window function
declare global {
  interface Window {
    handleNavigateRestaurant: (id: string) => void;
  }
}

const RestaurantMap = ({ restaurants, isFullScreen, onExitFullScreen }: RestaurantMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();

  // Expose navigate function to window for popup buttons
  useEffect(() => {
    window.handleNavigateRestaurant = (id: string) => {
      navigate(`/restaurant/${id}`);
    };

    return () => {
      // Cleanup is tricky if multiple maps exist, but for this app it's fine
      // strategies exist for unique names, but we have one map.
      delete (window as any).handleNavigateRestaurant;
    };
  }, [navigate]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [40.7128, -74.006],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when restaurants change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const createCustomIcon = (isTopRated: boolean) => {
      const color = isTopRated ? '#eab308' : 'hsl(15 80% 55%)';
      const innerContent = isTopRated
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
        : `<div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>`;

      return L.divIcon({
        html: `
          <div style="
            width: ${isTopRated ? '40px' : '32px'};
            height: ${isTopRated ? '40px' : '32px'};
            background: ${color};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            transform: ${isTopRated ? 'translateY(-4px)' : 'none'};
          ">
            ${innerContent}
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Add new markers
    restaurants.forEach((restaurant) => {
      const isTopRated = restaurant.tags?.includes('Top Rated') || false;
      const marker = L.marker([restaurant.lat, restaurant.lng], {
        icon: createCustomIcon(isTopRated),
      })
        .bindPopup(`
          <div class="p-1 text-center min-w-[140px] font-sans">
              <h3 class="font-bold text-sm mb-0.5 text-foreground leading-tight">${restaurant.name}</h3>
              <span class="text-xs text-muted-foreground uppercase tracking-wide block mb-2">${restaurant.tags[0] || 'Vendor'}</span>
              <button 
                onclick="window.handleNavigateRestaurant('${restaurant.id}')"
                class="inline-flex items-center justify-center w-full h-8 px-3 text-xs font-medium text-white bg-[#E67E22] hover:bg-[#D35400] rounded-full shadow-sm transition-colors cursor-pointer"
              >
                View Profile
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </button>
          </div>
        `);

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

  }, [restaurants]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '100vh', zIndex: 0 }}
      />

      {/* Exit Full Screen Button */}
      {isFullScreen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000]">
          <Button
            onClick={onExitFullScreen}
            variant="secondary"
            className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white text-sm px-6 py-2 h-auto"
          >
            <Minimize2 className="w-4 h-4 mr-2" />
            Exit Full Screen
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;
