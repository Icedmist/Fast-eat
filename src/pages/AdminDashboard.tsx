
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Truck, ShoppingCart, ChevronDown, Database } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminDashboard = () => {
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    role: 'chef',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data);
      }
    };

    const fetchDeliveries = async () => {
      const { data, error } = await supabase.from('deliveries').select('*');
      if (error) {
        console.error('Error fetching deliveries:', error);
      } else {
        setDeliveries(data);
      }
    };

    fetchOrders();
    fetchDeliveries();
  }, []);

  const handleCreateUser = async () => {
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUserData.email,
      password: newUserData.password,
    });

    if (authError) {
      alert('Error creating user: ' + authError.message);
      return;
    }

    if (authData.user) {
      // Step 2: Insert the user's role into the profiles table
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: authData.user.id, role: newUserData.role, full_name: newUserData.email },
      ]);

      if (profileError) {
        alert('Error setting user role: ' + profileError.message);
      } else {
        alert(`User with email ${newUserData.email} and role ${newUserData.role} created!`);
        setNewUserData({ email: '', password: '', role: 'chef' });
      }
    }
  };

  const handleSeedData = async () => {
    try {
      alert('Seeding database... This may take a moment.');
      // 1. Create a Chef user to own the restaurants
      const chefEmail = `chef-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: chefEmail,
        password: 'password123',
      });

      if (authError || !authData.user) {
        throw new Error(`Failed to create chef user: ${authError?.message}`);
      }
      const chefId = authData.user.id;

      // 2. Assign the 'chef' role to the new user's profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: chefId,
        role: 'chef',
        full_name: 'Sample Chef Owner',
      });

      if (profileError) {
        throw new Error(`Failed to create chef profile: ${profileError.message}`);
      }

      // 3. Create Restaurants
      const { data: restaurants, error: restaurantError } = await supabase.from('restaurants').insert([
        { owner_id: chefId, name: 'The Gourmet Kitchen', description: 'Classic American cuisine with a modern twist.', address: '123 Main St, Anytown, USA', phone_number: '555-1234', image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' },
        { owner_id: chefId, name: 'Pasta Paradise', description: 'Authentic Italian pasta and pizza.', address: '456 Oak Ave, Anytown, USA', phone_number: '555-5678', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5' },
      ]).select();

      if (restaurantError || !restaurants) {
        throw new Error(`Failed to create restaurants: ${restaurantError?.message}`);
      }

      const gourmetKitchenId = restaurants.find(r => r.name === 'The Gourmet Kitchen')?.id;
      const pastaParadiseId = restaurants.find(r => r.name === 'Pasta Paradise')?.id;

      if (!gourmetKitchenId || !pastaParadiseId) {
          throw new Error('Could not find created restaurant IDs.');
      }

      // 4. Create Dishes
      const { error: dishError } = await supabase.from('dishes').insert([
        { restaurant_id: gourmetKitchenId, name: 'Classic Burger', description: 'A juicy 1/2 pound burger with all the fixings.', price: 15.99, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
        { restaurant_id: gourmetKitchenId, name: 'Grilled Salmon', description: 'Fresh Atlantic salmon grilled to perfection.', price: 22.50, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2' },
        { restaurant_id: pastaParadiseId, name: 'Spaghetti Carbonara', description: 'A classic Roman pasta dish.', price: 18.00, image_url: 'https://images.unsplash.com/photo-1588013273468-31508b946d4d' },
        { restaurant_id: pastaParadiseId, name: 'Margherita Pizza', description: 'Fresh mozzarella, tomatoes, and basil.', price: 16.50, image_url: 'https://images.unsplash.com/photo-1598021680942-8aa5214e3436' },
      ]);

      if (dishError) {
        throw new Error(`Failed to create dishes: ${dishError.message}`);
      }

      alert('Successfully seeded the database with sample data!');
      // Optionally refresh data on screen
      // fetchOrders();
      // fetchDeliveries();
    } catch (error) {
        alert(`Seeding failed: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: 'chef' | 'rider') => {
    setNewUserData(prev => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome, talk2icedmist@gmail.com</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create User Card */}
          <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2" />
                  Create New User
                </CardTitle>
                <CardDescription>Add a new chef or rider to the system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="user@example.com" value={newUserData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={newUserData.password} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {newUserData.role === 'chef' ? 'Chef' : 'Rider'}
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onSelect={() => handleRoleChange('chef')}>Chef</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleRoleChange('rider')}>Rider</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={handleCreateUser} className="w-full">
                  Create User
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Seeding Card */}
          <motion.div whileHover={{ y: -5 }} className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2" />
                  Seed Data
                </CardTitle>
                <CardDescription>
                  Populate the database with sample restaurants and dishes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSeedData} className="w-full">
                  Add Sample Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Tracking Card */}
          <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2" />
                  Live Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer_id}</TableCell>
                        <TableCell>${order.total_price.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Delivery Tracking Card */}
          <motion.div whileHover={{ y: -5 }} className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2" />
                  Live Delivery Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Rider ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>{delivery.id}</TableCell>
                        <TableCell>{delivery.rider_id}</TableCell>
                        <TableCell>{delivery.order_id}</TableCell>
                        <TableCell>{delivery.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
