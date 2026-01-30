import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('customer');

    const handleSignUp = async () => {
        // Basic validation
        if (!fullName || !phoneNumber) {
            alert('Please fill in all fields.');
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else if (data.user) {
            // Use upsert to prevent duplicate profile errors
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: fullName,
                phone_number: phoneNumber,
                role: role,
            });

            if (profileError) {
                alert('Error creating user profile: ' + profileError.message);
            } else {
                alert('Sign up successful! Please check your email for a confirmation link before signing in.');
                window.location.href = '/signin';
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1234567890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                <ChevronDown />
                            </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                            <DropdownMenuItem onSelect={() => setRole('customer')}>Customer</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setRole('chef')}>Chef</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setRole('rider')}>Rider</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <button onClick={handleSignUp} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                        Sign Up
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;
