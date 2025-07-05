import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ptfmdwbfmlnrncsifaqb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Zm1kd2JmbWxucm5jc2lmYXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTE0MTMsImV4cCI6MjA2NzI2NzQxM30.2Iuq4iScDqWV5KP6HHlvXmG2al084xO14FBTqpmOt90'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})