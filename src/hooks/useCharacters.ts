import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import type {
  Character,
  CharacterFilter,
  CharactersData,
  CharactersVars,
} from "../types/api";
import { useDebounce } from "./useDebounce";

export type SortOrder = "newest" | "oldest";

// Rick and Morty API returns exactly 20 results per page — this is fixed by
// the API and cannot be configured via variables.
export const API_PAGE_SIZE = 20;

interface UseCharactersReturn {
  characters: Character[];
  loading: boolean;
  error: Error | undefined;
  isEmpty: boolean;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  searchTerm: string;
  statusFilter: string;
  speciesFilter: string;
  sortOrder: SortOrder;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (value: string) => void;
  setSpeciesFilter: (value: string) => void;
  setSortOrder: (order: SortOrder) => void;
  refetch: () => void;
}

export function useCharacters(): UseCharactersReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedSpecies = useDebounce(speciesFilter, 300);

  const filter: CharacterFilter | undefined = (() => {
    const f: CharacterFilter = {};
    if (debouncedSearch) f.name = debouncedSearch;
    if (statusFilter) f.status = statusFilter;
    if (debouncedSpecies) f.species = debouncedSpecies;
    return Object.keys(f).length > 0 ? f : undefined;
  })();

  // Reset to page 1 whenever filters change (otherwise users could land on
  // a page that no longer exists for the new filter set).
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, debouncedSpecies]);

  const { data, loading, error, refetch } = useQuery<
    CharactersData,
    CharactersVars
  >(GET_CHARACTERS, {
    variables: { page: currentPage, filter },
    fetchPolicy: "cache-and-network",
  });

  const rawCharacters = data?.characters?.results ?? [];
  const info = data?.characters?.info;

  // Client-side sort by creation date so the "Newest first" / "Oldest first"
  // toggle works even though the API does not natively support sorting.
  const characters = [...rawCharacters].sort((a, b) => {
    const diff = new Date(a.created).getTime() - new Date(b.created).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

  // Rick and Morty returns a GraphQL error (not a 200 with empty results)
  // when a filter matches nothing. We treat that as an empty state.
  const isFilterEmptyError =
    !!error && /nothing here|not found/i.test(error.message);
  const effectiveError = isFilterEmptyError ? undefined : error;

  const totalItems = info?.count ?? 0;
  const totalPages = info?.pages ?? 0;
  const isEmpty = !loading && characters.length === 0;

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    characters,
    loading,
    error: effectiveError,
    isEmpty,
    currentPage,
    totalItems,
    totalPages,
    searchTerm,
    statusFilter,
    speciesFilter,
    sortOrder,
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setSpeciesFilter,
    setSortOrder,
    refetch: handleRefetch,
  };
}

export default useCharacters;
