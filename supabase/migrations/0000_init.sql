
-- Drop existing tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create a table for public profiles
-- This table is linked to the authentication users table.
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name text,
    phone_number text,
    avatar_url text,
    role text NOT NULL CHECK (role IN ('customer', 'chef', 'rider'))
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create restaurants table
CREATE TABLE restaurants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    address text,
    location text,
    prep_time integer,
    is_accepting_orders boolean DEFAULT true,
    delivery_range integer,
    phone_number text,
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- Create dishes table
CREATE TABLE dishes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    image_url text,
    available boolean DEFAULT true,
    category text,
    created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
    status text NOT NULL, -- 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
    total_price numeric(10, 2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    dish_id uuid REFERENCES dishes(id) ON DELETE CASCADE,
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL
);

-- Create deliveries table
CREATE TABLE deliveries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    rider_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    status text NOT NULL, -- 'pending', 'assigned', 'in_transit', 'delivered'
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE chats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
    dish_id uuid REFERENCES dishes(id) ON DELETE CASCADE,
    rating integer NOT NULL,
    comment text,
    created_at timestamptz DEFAULT now()
);
