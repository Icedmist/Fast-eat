export interface Restaurant {
  id: string;
  name: string;
  category: 'Appetizers' | 'Main' | 'Dessert' | 'Drinks';
  image: string;
  rating: number;
  distance: string;
  price: string;
  description: string;
  lat: number;
  lng: number;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Truffle Burrata',
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    rating: 4.9,
    distance: '0.3 mi',
    price: '$18',
    description: 'Fresh burrata with black truffle and heirloom tomatoes',
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: '2',
    name: 'Wagyu Steak',
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    rating: 4.8,
    distance: '0.5 mi',
    price: '$65',
    description: 'A5 Wagyu with truffle butter and seasonal vegetables',
    lat: 40.7138,
    lng: -74.0070,
  },
  {
    id: '3',
    name: 'Matcha Tiramisu',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    rating: 4.7,
    distance: '0.8 mi',
    price: '$14',
    description: 'Japanese-Italian fusion with ceremonial grade matcha',
    lat: 40.7148,
    lng: -74.0050,
  },
  {
    id: '4',
    name: 'Craft Espresso Martini',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    rating: 4.6,
    distance: '0.2 mi',
    price: '$16',
    description: 'Cold brew espresso with premium vodka and vanilla',
    lat: 40.7118,
    lng: -74.0080,
  },
  {
    id: '5',
    name: 'Seared Tuna Tataki',
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    rating: 4.9,
    distance: '0.4 mi',
    price: '$22',
    description: 'Sashimi-grade tuna with ponzu and microgreens',
    lat: 40.7158,
    lng: -74.0040,
  },
  {
    id: '6',
    name: 'Lobster Risotto',
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    rating: 4.8,
    distance: '0.6 mi',
    price: '$42',
    description: 'Creamy arborio rice with Maine lobster and saffron',
    lat: 40.7168,
    lng: -74.0090,
  },
  {
    id: '7',
    name: 'Crème Brûlée',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&q=80',
    rating: 4.5,
    distance: '0.7 mi',
    price: '$12',
    description: 'Classic Tahitian vanilla with caramelized sugar',
    lat: 40.7108,
    lng: -74.0100,
  },
  {
    id: '8',
    name: 'Signature Old Fashioned',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    rating: 4.7,
    distance: '0.3 mi',
    price: '$18',
    description: 'Bourbon aged in oak with orange and bitters',
    lat: 40.7098,
    lng: -74.0055,
  },
];

export const categories = ['All', 'Appetizers', 'Main', 'Dessert', 'Drinks'] as const;
export type Category = typeof categories[number];
