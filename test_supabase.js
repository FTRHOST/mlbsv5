import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('operator_id', '2227449547')
    .single();

  if (error) {
    console.error('Error fetching data:', error.message);
  } else {
    console.log('Data fetched successfully!');
    // Print only some keys to check if it has the required structure
    console.log("Keys:", Object.keys(data));
    if (data.data) {
        console.log("Data keys:", Object.keys(data.data));
        if (data.data.Battle) {
            console.log("Battle time:", data.data.Battle.waktuPertandingan);
            console.log("Blue Kills:", data.data.Battle.blueTeamKill);
        }
    } else {
        console.log(data);
    }
  }
}
test();
