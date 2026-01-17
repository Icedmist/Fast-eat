import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { restaurants } from '@/data/restaurants';

const RestaurantMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

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

    // Create custom icon
    const createCustomIcon = () => {
      return L.divIcon({
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: hsl(15 80% 55%);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Add markers
    restaurants.forEach((restaurant) => {
      L.marker([restaurant.lat, restaurant.lng], {
        icon: createCustomIcon(),
      }).addTo(map);
    });

    // Adjust center for bottom sheet
    setTimeout(() => {
      const center = map.getCenter();
      map.setView([center.lat + 0.002, center.lng], map.getZoom());
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full" 
      style={{ minHeight: '100vh' }}
    />
  );
};

export default RestaurantMap;