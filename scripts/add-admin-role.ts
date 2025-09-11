import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znvlwsieksjvyetulqhs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpudmx3c2lla3NqdnlldHVscWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzg0MTcsImV4cCI6MjA3MjYxNDQxN30.v7QH2D3ydsG07Kw_cagN5ZoH_AAznYExbwLbKabGPYY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdminRole(userEmail: string) {
  try {
    // First, get the user's ID
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', userEmail)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    // Delete any existing role for the user
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userData.user_id);

    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userData.user_id,
        role: 'admin'
      });

    if (roleError) throw roleError;

    console.log('Successfully added admin role to user:', userEmail);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Replace with your email
addAdminRole('your-email@example.com');
