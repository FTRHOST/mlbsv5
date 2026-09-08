import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

console.log("Subscribing to realtime updates for 2229935284...");
const channel = supabase
  .channel('live-match')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'rooms',
    },
    (payload) => {
      console.log('Received payload!', payload);
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });

setTimeout(() => {
    console.log("Closing test...");
    supabase.removeChannel(channel);
    process.exit(0);
}, 10000);
