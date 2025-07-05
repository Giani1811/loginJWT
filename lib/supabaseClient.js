import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kdxgwqszxdaexnrcyhvz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeGd3cXN6eGRhZXhucmN5aHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODMzOTIsImV4cCI6MjA2NzI1OTM5Mn0.xPFSROtY_7dtQ0MoSs5kGbqk8o8rRv3VvbOhq-OkIWo'

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