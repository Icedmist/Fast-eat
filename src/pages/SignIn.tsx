import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        console.log('Attempting to sign in with:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error signing in:', error);
            alert('Error signing in: ' + error.message);
        } else if (data.user) {
            console.log('Sign-in successful for user:', data.user.id);
            // Fetch the user's profile, but handle multiple returns by taking the first
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id);

            if (profileError) {
                console.error('Error fetching user profile:', profileError);
                alert('Error fetching user profile: ' + profileError.message);
            } else if (profileData && profileData.length > 0) {
                // Use the first profile found to avoid the "coerce" error
                const userProfile = profileData[0];
                console.log('User role found:', userProfile.role);
                switch (userProfile.role) {
                    case 'admin':
                        window.location.href = '/admin';
                        break;
                    case 'chef':
                        window.location.href = '/chef-dashboard';
                        break;
                    case 'rider':
                        window.location.href = '/rider-dashboard';
                        break;
                    default:
                        window.location.href = '/discover';
                }
            } else {
                console.warn('User profile not found for user:', data.user.id);
                // This could happen if a user exists in auth but not in profiles.
                // Let's create a default profile for them to be safe.
                const { error: insertError } = await supabase.from('profiles').insert({
                    id: data.user.id,
                    role: 'customer',
                    full_name: 'New User'
                });
                if (insertError) {
                     alert('Could not create a user profile. Please contact support.');
                } else {
                     window.location.href = '/discover'; // Redirect to customer view
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSignIn} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                        Sign In
                    </button>
                    <p className="text-center text-sm">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;
