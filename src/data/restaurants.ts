export type Category = 'Appetizers' | 'Main' | 'Dessert' | 'Drinks';

export const categories: Category[] = ['All' as any, 'Appetizers', 'Main', 'Dessert', 'Drinks'];

export interface MenuItem {
  id: string;
  name: string;
  price: number; // Storing as number for easier calculations
  description: string;
  image: string;
  category: Category;
  rating?: number;
}

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
}

export interface Restaurant {
  id: string;
  name: string; // Vendor Name
  image: string; // Profile/Hero Image
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  bio: string;
  workingHours: WorkingHour[];
  lat: number;
  lng: number;
  tags: string[]; // Vendor tags
  menu: MenuItem[];
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mama Put Deluxe',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8,
    reviewCount: 124,
    distance: '0.3 mi',
    address: '12 Lagos Street, Gombe',
    bio: 'Authentic Nigerian cuisine served with love. Specializing in traditional soups and swallows that taste just like home.',
    workingHours: [
      { day: 'Mon - Fri', open: '08:00 AM', close: '09:00 PM' },
      { day: 'Sat', open: '10:00 AM', close: '10:00 PM' },
      { day: 'Sun', open: 'Closed', close: 'Closed' }
    ],
    lat: 10.2897,
    lng: 11.1673, // Gombe coordinates approx
    tags: ['Local', 'Traditional', 'Soups'],
    menu: [
      {
        id: 'm1-1',
        name: 'Pounded Yam & Egusi',
        price: 3500,
        description: 'Smooth pounded yam paired with rich, nutty Egusi soup and assorted meats.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200',
        category: 'Main',
        rating: 4.9
      },
      {
        id: 'm1-2',
        name: 'Peppered Snail',
        price: 4500,
        description: 'Giant African land snails sautéed in a spicy pepper sauce.',
        image: 'https://images.unsplash.com/photo-1606756790138-7c488320e54f?auto=format&fit=crop&q=80&w=200',
        category: 'Appetizers',
        rating: 4.7
      }
    ]
  },
  {
    id: '2',
    name: 'Taste of Gombe',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    rating: 4.9,
    reviewCount: 89,
    distance: '0.5 mi',
    address: '45 Biu Road, Gombe',
    bio: 'The finest Masa spots in town. We blend tradition with modern spices to give you the best Masa experience.',
    workingHours: [
      { day: 'Mon - Sun', open: '07:00 AM', close: '10:00 PM' }
    ],
    lat: 10.2910,
    lng: 11.1700,
    tags: ['Masa', 'Breakfast', 'Street Food'],
    menu: [
      {
        id: 'm2-1',
        name: 'Special Gombe Masa',
        price: 1500,
        description: 'Traditional rice cakes served with spicy vegetable soup and yaji.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        category: 'Main',
        rating: 5.0
      },
      {
        id: 'm2-2',
        name: 'Masa & Suya Combo',
        price: 2500,
        description: '4 pieces of Masa served with tender beef Suya.',
        image: 'https://images.unsplash.com/photo-1626509653294-46324888846c?auto=format&fit=crop&q=80&w=200',
        category: 'Main',
        rating: 4.8
      },
      {
        id: 'm2-3',
        name: 'Kunu Aya',
        price: 1000,
        description: 'Chilled tigernut milk drink.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=200',
        category: 'Drinks',
        rating: 4.6
      }
    ]
  },
  {
    id: '3',
    name: 'Grill & Chill Spot',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=1000',
    rating: 4.5,
    reviewCount: 210,
    distance: '1.2 mi',
    address: 'Near Gombe State University',
    bio: 'Your go-to spot for grilled delicacies and refreshing drinks. Perfect for evening hangouts.',
    workingHours: [
      { day: 'Mon - Sat', open: '12:00 PM', close: '11:00 PM' }
    ],
    lat: 10.2850,
    lng: 11.1600,
    tags: ['Grill', 'Suya', 'Nightlife'],
    menu: [
      {
        id: 'm3-1',
        name: 'Beef Suya Platter',
        price: 3000,
        description: 'Spicy grilled beef skewers served with onions, tomatoes and masa.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
        category: 'Main',
        rating: 4.7
      },
      {
        id: 'm3-2',
        name: 'Grilled Catfish',
        price: 6500,
        description: 'Whole catfish marinated in spicy sauce and grilled to perfection.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
        category: 'Main',
        rating: 4.5
      },
      {
        id: 'm3-3',
        name: 'Chapman',
        price: 2000,
        description: 'Classic Nigerian cocktail with fruity flavors.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
        category: 'Drinks',
        rating: 4.8
      }
    ]
  },
  {
    id: '4',
    name: 'Sweet Tooth Confectionery',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
    rating: 4.7,
    reviewCount: 56,
    distance: '0.8 mi',
    address: 'GRA Road, Gombe',
    bio: 'Satisfying your cravings with freshly baked pastries, cakes, and desserts.',
    workingHours: [
      { day: 'Mon - Sat', open: '09:00 AM', close: '07:00 PM' }
    ],
    lat: 10.2880,
    lng: 11.1650,
    tags: ['Bakery', 'Dessert', 'Sweet'],
    menu: [
      {
        id: 'm4-1',
        name: 'Meat Pie',
        price: 800,
        description: 'Flaky pastry filled with seasoned minced meat and potatoes.',
        image: 'https://images.unsplash.com/photo-1572383672419-ab4779963fb0?auto=format&fit=crop&q=80&w=200',
        category: 'Appetizers',
        rating: 4.6
      },
      {
        id: 'm4-2',
        name: 'Doughnut Box (6pcs)',
        price: 2500,
        description: 'Assorted glazed and filled doughnuts.',
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=200',
        category: 'Dessert',
        rating: 4.8
      }
    ]
  }
];
