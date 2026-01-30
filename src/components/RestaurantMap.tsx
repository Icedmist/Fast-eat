import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom restaurant icon
const restaurantIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Restaurant {
  id: string;
  name: string;
  location: string; // "lat,lng"
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onToggleView: () => void;
}

const RestaurantMap = ({ restaurants, onToggleView }: RestaurantMapProps) => {
  const navigate = useNavigate();
  const gombePosition: [number, number] = [10.2833, 11.1667]; // Gombe, Nigeria
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(gombePosition);

  useEffect(() => {
    // Try to get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userCoords: [number, number] = [latitude, longitude];
        setUserPosition(userCoords);
        setMapCenter(userCoords); // Center map on user
      },
      () => {
        console.log("User denied geolocation. Defaulting to Gombe.");
        // If user denies, we just keep the default Gombe position
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="relative w-full h-full">
      <MapContainer key={mapCenter.toString()} center={mapCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's Location Marker */}
        {userPosition && (
            <CircleMarker center={userPosition} radius={8} pathOptions={{ color: '#007BFF', fillColor: '#007BFF', fillOpacity: 1 }}>
                <Popup>You are here</Popup>
            </CircleMarker>
        )}

        {/* Restaurant Markers */}
        {restaurants.map(restaurant => {
          const locParts = restaurant.location?.split(',').map(part => parseFloat(part.trim()));
          if (!locParts || locParts.length !== 2 || isNaN(locParts[0]) || isNaN(locParts[1])) {
            return null;
          }
          const position: [number, number] = [locParts[0], locParts[1]];
          
          return (
            <Marker key={restaurant.id} position={position} icon={restaurantIcon}>
              <Popup>
                <div className="p-1 w-32">
                    <h3 className="font-bold text-base truncate">{restaurant.name}</h3>
                    <button 
                        onClick={() => navigate(`/restaurant/${restaurant.id}`)} 
                        className="text-primary text-sm font-semibold mt-1 w-full text-left">
                        View Details
                    </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <motion.button
        onClick={onToggleView}
        className="absolute top-6 right-6 z-10 flex items-center gap-2 font-semibold text-primary bg-card px-4 py-2 rounded-full shadow-lg"
        whileTap={{ scale: 0.95 }}
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        transition={{delay: 0.2}}
      >
        <List size={16}/>
        <span>List</span>
      </motion.button>
    </div>
  );
};

export default RestaurantMap;
