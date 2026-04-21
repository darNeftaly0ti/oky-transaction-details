import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES, GET_LAUNCHES_COUNT } from "../graphql/queries";
import type { LaunchesData, LaunchesVars, LaunchFind, LaunchesCountData, Launch } from "../types/api";
import { useDebounce } from "./useDebounce";

export type SortOrder = "newest" | "oldest";

interface UseLaunchesOptions {
  pageSize?: number;
}

interface UseLaunchesReturn {
  launches: Launch[];
  loading: boolean;
  error: Error | undefined;
  isEmpty: boolean;
  currentPage: number;
  totalItems: number;
  searchTerm: string;
  successFilter: boolean | null;
  rocketFilter: string;
  sortOrder: SortOrder;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSuccessFilter: (value: boolean | null) => void;
  setRocketFilter: (value: string) => void;
  setSortOrder: (order: SortOrder) => void;
  refetch: () => void;
}

export function useLaunches(options: UseLaunchesOptions = {}): UseLaunchesReturn {
  const { pageSize = 9 } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [successFilter, setSuccessFilter] = useState<boolean | null>(null);
  const [rocketFilter, setRocketFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedRocket = useDebounce(rocketFilter, 300);

  const find: LaunchFind | undefined = (() => {
    const f: LaunchFind = {};
    if (debouncedSearch) f.mission_name = debouncedSearch;
    if (successFilter !== null) f.launch_success = successFilter;
    if (debouncedRocket) f.rocket_name = debouncedRocket;
    return Object.keys(f).length > 0 ? f : undefined;
  })();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, successFilter, debouncedRocket]);

  const { data, loading, error, refetch } = useQuery<LaunchesData, LaunchesVars>(
    GET_LAUNCHES,
    {
      variables: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        find,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: countData } = useQuery<LaunchesCountData>(GET_LAUNCHES_COUNT, {
    variables: { find },
    fetchPolicy: "cache-and-network",
  });

  const rawLaunches = data?.launches ?? [];

  // Client-side sort by launch date
  const launches = [...rawLaunches].sort((a, b) => {
    const diff =
      new Date(a.launch_date_local).getTime() -
      new Date(b.launch_date_local).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

  const totalItems = countData?.launchesCount ?? 0;
  const isEmpty = !loading && launches.length === 0;

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    launches,
    loading,
    error,
    isEmpty,
    currentPage,
    totalItems,
    searchTerm,
    successFilter,
    rocketFilter,
    sortOrder,
    setCurrentPage,
    setSearchTerm,
    setSuccessFilter,
    setRocketFilter,
    setSortOrder,
    refetch: handleRefetch,
  };
}

export default useLaunches;
