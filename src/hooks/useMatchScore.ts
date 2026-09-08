import { useEffect, useState } from 'react';
import { supabase } from './useRoomData';
import { appConfig } from '../config';

export function useMatchScore(blueTeamName?: string, redTeamName?: string) {
  const [score, setScore] = useState({ blueScore: 0, redScore: 0, bestOf: 3 });

  useEffect(() => {
    let isMounted = true;
    
    async function fetchScore() {
      if (!blueTeamName && !redTeamName) return;
      if (!supabase) return;
      
      try {
        // 1. Fetch match_setup
        const { data: matchSetupData } = await supabase
          .from('match_setup')
          .select('*')
          .eq('operator_id', appConfig.operatorId)
          .order('updated_at', { ascending: false })
          .limit(1);
          
        if (!matchSetupData || matchSetupData.length === 0) return;
        const setup = matchSetupData[0];
        const team1 = setup.Team1Name;
        const team2 = setup.Team2Name;
        const bestOf = setup.best_of || 3;
        
        // 2. Fetch team_mappings
        const { data: mappingData } = await supabase
          .from('team_mappings')
          .select('*')
          .eq('operator_id', appConfig.operatorId)
          .in('team_name', [team1, team2]);
          
        if (!mappingData) return;
        
        const teamToUid: Record<string, string> = {};
        mappingData.forEach((m: any) => {
           teamToUid[m.team_name] = m.uid;
        });
        
        const uid1 = teamToUid[team1];
        const uid2 = teamToUid[team2];
        
        // 3. Fetch stats
        const { data: statsData } = await supabase
          .from('stats')
          .select('*')
          .eq('operator_id', appConfig.operatorId);
          
        if (!statsData) return;
        
        let team1Wins = 0;
        let team2Wins = 0;
        
        statsData.forEach((stat: any) => {
          try {
            const data = typeof stat.data === 'string' ? JSON.parse(stat.data) : stat.data;
            const players = data.players || [];
            const winCamp = data.Battle?.winCamp;
            
            let t1Camp = 0;
            let t2Camp = 0;
            
            players.forEach((p: any) => {
               if (p.id === uid1) t1Camp = p.team;
               if (p.id === uid2) t2Camp = p.team;
            });
            
            // Check if both representative players were in this match
            if (t1Camp > 0 && t2Camp > 0) {
               if (winCamp === t1Camp) team1Wins++;
               else if (winCamp === t2Camp) team2Wins++;
            }
          } catch (e) {}
        });
        
        let finalBlue = 0;
        let finalRed = 0;
        
        if (blueTeamName === team1) finalBlue = team1Wins;
        if (blueTeamName === team2) finalBlue = team2Wins;
        
        if (redTeamName === team1) finalRed = team1Wins;
        if (redTeamName === team2) finalRed = team2Wins;
        
        if (isMounted) {
          setScore({ blueScore: finalBlue, redScore: finalRed, bestOf });
        }
      } catch (err) {
        console.error("Error calculating match score:", err);
      }
    }
    
    fetchScore();
    
    if (supabase) {
      const channelName = `schema-db-changes-score-${Math.random().toString(36).substring(7)}`;
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stats' }, () => {
           fetchScore();
        })
        .subscribe();
        
      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    } else {
      return () => { isMounted = false; };
    }
  }, [blueTeamName, redTeamName]);

  return score;
}
