
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Truck, ShoppingCart, ChevronDown, Database, Loader2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'chef' as 'chef' | 'rider',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const ordersPromise = supabase.from('orders').select('*');
      const deliveriesPromise = supabase.from('deliveries').select('*');
      const [{ data: ordersData, error: ordersError }, { data: deliveriesData, error: deliveriesError }] = await Promise.all([ordersPromise, deliveriesPromise]);

      if (ordersError) console.error('Error fetching orders:', ordersError);
      else setOrders(ordersData || []);

      if (deliveriesError) console.error('Error fetching deliveries:', deliveriesError);
      else setDeliveries(deliveriesData || []);
    };

    fetchInitialData();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password || !newUserData.full_name) {
        alert('Please fill in all fields.');
        return;
    }
    setIsSubmitting(true);
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUserData.email,
      password: newUserData.password,
    });

    if (authError) {
      alert('Error creating user: ' + authError.message);
      setIsSubmitting(false);
      return;
    }

    if (authData.user) {
      // Step 2: Insert the user's profile with their role and full name
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: authData.user.id, role: newUserData.role, full_name: newUserData.full_name },
      ]);

      if (profileError) {
        // Attempt to clean up the created auth user if profile creation fails
        // This is important for preventing orphaned auth users.
        // Note: This requires admin privileges.
        await supabase.auth.admin.deleteUser(authData.user.id)
        alert('Error setting user role: ' + profileError.message);
      } else {
        alert(`User with email ${newUserData.email} and role ${newUserData.role} created successfully!`);
        setNewUserData({ email: '', password: '', full_name: '', role: 'chef' });
      }
    }
    setIsSubmitting(false);
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
          <p className="text-gray-500">System management and overview</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create User Card */}
          <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 text-indigo-600" />
                  Create New User
                </CardTitle>
                <CardDescription>Add a new chef or rider to the system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" type="text" placeholder="e.g., Mariam Abubakar" value={newUserData.full_name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="user@example.com" value={newUserData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input id="password" name="password" type="password" value={newUserData.password} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between capitalize">
                        {newUserData.role}
                        <ChevronDown className="w-4 h-4"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                      <DropdownMenuItem onSelect={() => handleRoleChange('chef')}>Chef</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleRoleChange('rider')}>Rider</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={handleCreateUser} disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? <Loader2 className="animate-spin"/> : 'Create User'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Seeding Card */}
          <motion.div whileHover={{ y: -5 }} className="col-span-1">
             <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 text-green-600" />
                  Database Tools
                </CardTitle>
                <CardDescription>
                  Populate the database with sample restaurants and dishes for testing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Seed Sample Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Tracking Card */}
          <motion.div whileHover={{ y: -5 }} className="md:col-span-2 lg:col-span-3">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 text-blue-600" />
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
                        <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{order.customer_id.substring(0, 8)}...</TableCell>
                        <TableCell>₦{order.total_price.toLocaleString()}</TableCell>
                        <TableCell><span className="capitalize px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{order.status}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Delivery Tracking Card */}
          <motion.div whileHover={{ y: -5 }} className="md:col-span-3">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 text-orange-600" />
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
                        <TableCell className="font-mono text-xs">{delivery.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{delivery.rider_id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{delivery.order_id.substring(0, 8)}...</TableCell>
                        <TableCell><span className="capitalize px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{delivery.status}</span></TableCell>
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
