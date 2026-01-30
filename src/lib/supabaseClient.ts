import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wldzfmedulnjhgonougn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZHpmbWVkdWxuamhnb25vdWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY4NDcsImV4cCI6MjA4NTI3Mjg0N30.P1rjbu2eGaPpZ_8YWWALBB-Kyy17HB-k81bGRM0I3Ro';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
