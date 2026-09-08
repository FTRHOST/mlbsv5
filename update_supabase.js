import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching current blueTeamKill...");
  const { data } = await supabase.from('rooms').select('battle').eq('operator_id', '2229935284').single();
  let currentKills = data?.battle?.blueTeamKill || 0;
  
  console.log("Updating blueTeamKill to", currentKills + 1);
  const newBattle = { ...data.battle, blueTeamKill: currentKills + 1 };
  
  const { error } = await supabase.from('rooms').update({ battle: newBattle }).eq('operator_id', '2229935284');
  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log("Update success!");
  }
}
test();
