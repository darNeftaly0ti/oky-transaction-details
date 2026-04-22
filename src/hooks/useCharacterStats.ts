import { useQuery } from "@apollo/client";
import { GET_STATS } from "../graphql/queries";
import type { StatsData } from "../types/api";

interface UseCharacterStatsReturn {
  total: number;
  alive: number;
  dead: number;
  aliveRate: number;
  loading: boolean;
}

export function useCharacterStats(): UseCharacterStatsReturn {
  const { data, loading } = useQuery<StatsData>(GET_STATS, {
    fetchPolicy: "cache-first",
  });

  const total = data?.total?.info.count ?? 0;
  const alive = data?.alive?.info.count ?? 0;
  const dead = data?.dead?.info.count ?? 0;
  const aliveRate = total > 0 ? Math.round((alive / total) * 100) : 0;

  return { total, alive, dead, aliveRate, loading };
}

export default useCharacterStats;
