// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://supabase.com/dashboard/project/qfcdmzijpshqgktqdcvh"; // Replace with your URL
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YXd0dXZlZ2VueWNmd3hoeWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTUyNzAsImV4cCI6MjA1NTg5MTI3MH0.dU6tyy-RbLnf43v-crPzgpMh7HUvRRYrjkja3jCim4k"; // Replace with your anon key

// export const supabase = createClient(supabaseUrl, supabaseKey);


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xvawtuvegenycfwxhyds.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YXd0dXZlZ2VueWNmd3hoeWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMTUyNzAsImV4cCI6MjA1NTg5MTI3MH0.dU6tyy-RbLnf43v-crPzgpMh7HUvRRYrjkja3jCim4k"; // Replace with your anon key

// export const supabase = createClient(supabaseUrl, supabaseKey)
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
    },
  });