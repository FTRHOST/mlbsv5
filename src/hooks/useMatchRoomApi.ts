import { useState, useEffect, useCallback } from "react";
import { HERO_MAP, EQUIP_MAP } from "@/data/mlbbDict";
import { DEFAULT_MATCH_DATA } from "@/data/defaultRoomData";

export interface PlayerData {
  name: string;
  camp: number; // 1 = Blue/Red, 2 = Blue/Red
  score: number;
  heroid: number;
  max_level: number;
  gold_total: number;
  kill_num: number;
  dead_num: number;
  assist_num: number;
  is_mvp: boolean;
  equip_list: number[];
  hero_hurt?: number;
  hurted?: number;
  tower_hurt?: number;
  grade?: number;
  battle_skill_id?: number;
  is_hide_info?: boolean;
}

export interface BattleData {
  win_camp: number; // 1 or 2
  red_camp_kill: number;
  blue_camp_kill: number;
  battleid: number | string;
  battleidStr: string;
  end_time: string;
  game_time: number; // in seconds
  pvptype?: number;
  mapid?: number;
  player_list: PlayerData[];
}

export interface MatchRoomData {
  url?: string;
  message?: string;
  name: string;
  status?: string;
  isClosed?: boolean;
  isValidate?: boolean;
  battleData: BattleData;
}

export interface MatchApiResponse {
  code: number;
  message: string;
  data: MatchRoomData;
}

// Helpers for hero head and equip icon paths according to requested asset structure
export function getHeroIconPath(heroId: number): string {
  return `/asset/heroes-icon/${heroId}.png`;
}

export function getEquipIconPath(equipId: number): string {
  return `/asset/equips/${equipId}.png`;
}

export function useMatchRoomApi(matchId?: string) {
  const [data, setData] = useState<MatchRoomData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [heroDict, setHeroDict] = useState<Record<number, string>>(HERO_MAP);
  const [equipDict, setEquipDict] = useState<Record<number, { icon: string; name: string }>>(EQUIP_MAP);

  const fetchMatch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://sg-api.mobilelegends.com/matchTools/v1/getMatchUrl?matchId=${id}&_t=${Date.now()}`;
      const res = await fetch(url, {
        headers: {
          "accept": "application/json, text/plain, */*",
          "x-appid": "2636539",
          "x-lang": "en"
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json: MatchApiResponse = await res.json();
      if (json.code === 0 && json.data && json.data.battleData) {
        setData(json.data);
      } else if (id === "6a737ab4ac75df7a21fc4969" || DEFAULT_MATCH_DATA.data) {
        setData(DEFAULT_MATCH_DATA.data as MatchRoomData);
      } else {
        setError(json.message || "Failed to load match data");
      }
    } catch (err: any) {
      console.warn("Using fallback match data due to fetch error:", err);
      if (DEFAULT_MATCH_DATA.data) {
        setData(DEFAULT_MATCH_DATA.data as MatchRoomData);
      } else {
        setError(err?.message || "Failed to fetch match room data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dynamic hero and equipment dictionaries and bind to /asset/heroes-icon/ and /asset/equips/
  useEffect(() => {
    let isMounted = true;
    async function loadDicts() {
      try {
        const [heroRes, equipRes] = await Promise.allSettled([
          fetch("https://api.gms.moontontech.com/api/gms/source/2713644/2766683", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ fields: ["hero_id", "head"], pageSize: 500 })
          }),
          fetch("https://api.gms.moontontech.com/api/gms/source/2713644/2775075", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ fields: ["equipid", "equipname", "equipicon"], pageSize: 500 })
          })
        ]);

        if (heroRes.status === "fulfilled" && heroRes.value.ok) {
          const heroJson = await heroRes.value.json();
          if (heroJson.data?.records) {
            const newHeroes: Record<number, string> = { ...HERO_MAP };
            heroJson.data.records.forEach((r: any) => {
              if (r.data?.hero_id) {
                // Map head to /asset/heroes-icon/{hero_id}.png with fallback to remote head URL
                newHeroes[r.data.hero_id] = `/asset/heroes-icon/${r.data.hero_id}.png` || r.data.head;
              }
            });
            if (isMounted) setHeroDict(newHeroes);
          }
        }

        if (equipRes.status === "fulfilled" && equipRes.value.ok) {
          const equipJson = await equipRes.value.json();
          if (equipJson.data?.records) {
            const newEquips: Record<number, { icon: string; name: string }> = { ...EQUIP_MAP };
            equipJson.data.records.forEach((r: any) => {
              if (r.data?.equipid) {
                // Map equipicon to /asset/equips/{equipid}.png with fallback to remote equipicon URL
                newEquips[r.data.equipid] = {
                  icon: `/asset/equips/${r.data.equipid}.png` || r.data.equipicon || "",
                  name: r.data.equipname || ""
                };
              }
            });
            if (isMounted) setEquipDict(newEquips);
          }
        }
      } catch (e) {
        // Fallback to initial dict
      }
    }
    loadDicts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const targetId = matchId || "6a737ab4ac75df7a21fc4969";
    fetchMatch(targetId);
  }, [matchId, fetchMatch]);

  return {
    data,
    loading,
    error,
    heroDict,
    equipDict,
    refetch: () => fetchMatch(matchId || "6a737ab4ac75df7a21fc4969")
  };
}
