import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { restaurants } from '@/data/restaurants';
import { useEffect } from 'react';

// Custom marker icon
const createCustomIcon = () => {
  return new DivIcon({
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

// Map center adjuster component
const MapCenterAdjuster = () => {
  const map = useMap();
  
  useEffect(() => {
    // Slightly offset center to account for bottom sheet
    setTimeout(() => {
      const center = map.getCenter();
      map.setView([center.lat + 0.002, center.lng], map.getZoom());
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

const RestaurantMap = () => {
  const center: [number, number] = [40.7128, -74.006];

  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapCenterAdjuster />
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.lat, restaurant.lng]}
            icon={createCustomIcon()}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;
