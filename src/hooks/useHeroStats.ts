import { useEffect, useState } from 'react';
import { supabase } from './useRoomData';
import { appConfig } from '../config';

export function useHeroStats(heroId: number) {
  const [stats, setStats] = useState({ winRate: "0%", pick: 0, ban: 0, heroName: "UNKNOWN" });

  useEffect(() => {
    if (!heroId || heroId === 0) return;
    let isMounted = true;
    
    async function fetchStats() {
      try {
        // Fetch hero name
        let heroName = "UNKNOWN";
        try {
          const res = await fetch('/assets/heroes.json');
          const heroes = await res.json();
          // Adjust based on how heroes.json is structured. Usually an object mapping ID to name or object.
          if (heroes && heroes[heroId]) {
            heroName = heroes[heroId].name || heroes[heroId];
            if (typeof heroName !== 'string') heroName = "UNKNOWN";
          }
        } catch (e) {
          console.error("Failed to load heroes.json", e);
        }

        // Fetch stats from Supabase
        if (supabase) {
          const { data, error } = await supabase
            .from('stats')
            .select('data')
            .eq('operator_id', appConfig.operatorId);
            
          if (error) throw error;
          
          let wins = 0;
          let picks = 0;
          let bans = 0;
          
          if (data && data.length > 0) {
            data.forEach((row) => {
               try {
                 const jsonData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
                 const players = jsonData?.players || [];
                 const winCamp = jsonData?.Battle?.winCamp;
                 
                 players.forEach((p: any) => {
                   if (p.heroid === heroId || p.SelHeroID === heroId) {
                     picks++;
                     if (winCamp === p.team) {
                       wins++;
                     }
                   }
                   if (p.banHero === heroId) {
                     bans++;
                   }
                 });
               } catch (e) {}
            });
          }
          
          let winRate = picks > 0 ? ((wins / picks) * 100).toFixed(2) + "%" : "0.00%";
          
          if (isMounted) {
            setStats({ winRate, pick: picks, ban: bans, heroName: heroName.toUpperCase() });
          }
        }
      } catch (err) {
        console.error("Error fetching hero stats:", err);
      }
    }
    
    fetchStats();
    
    return () => { isMounted = false; };
  }, [heroId]);

  return stats;
}
