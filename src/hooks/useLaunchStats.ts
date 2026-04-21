import { useQuery } from "@apollo/client";
import { GET_STATS } from "../graphql/queries";
import type { StatsData } from "../types/api";

interface UseLaunchStatsReturn {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  loading: boolean;
}

export function useLaunchStats(): UseLaunchStatsReturn {
  const { data, loading } = useQuery<StatsData>(GET_STATS, {
    fetchPolicy: "cache-first",
  });

  const total = data?.total ?? 0;
  const successful = data?.successful ?? 0;
  const failed = data?.failed ?? 0;
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  return { total, successful, failed, successRate, loading };
}

export default useLaunchStats;
