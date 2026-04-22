import React, { useEffect, useCallback, useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import TransactionList from "../components/TransactionList";
import TransactionDetail from "../components/TransactionDetail";
import Pagination from "../components/Pagination";
import SearchFilter from "../components/SearchFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatsBar from "../components/StatsBar";
import { useCharacters, API_PAGE_SIZE } from "../hooks/useCharacters";
import { useCharacterDetail } from "../hooks/useCharacterDetail";

const IndexPage: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const selectedId = params.get("id");

  // Apollo hooks use `window` internally. During `gatsby build` the page is
  // rendered in Node.js (no window), so we gate all data-fetching on mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    characters,
    loading,
    error,
    isEmpty,
    currentPage,
    totalItems,
    statusFilter,
    speciesFilter,
    sortOrder,
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setSpeciesFilter,
    setSortOrder,
    refetch,
  } = useCharacters();

  const {
    character: selectedCharacter,
    loading: detailLoading,
    error: detailError,
    fetchCharacter,
    clearCharacter,
  } = useCharacterDetail();

  useEffect(() => {
    if (selectedId) {
      fetchCharacter(selectedId);
    } else {
      clearCharacter();
    }
  }, [selectedId, fetchCharacter, clearCharacter]);

  const handleCardClick = useCallback((id: string) => {
    void navigate(`/?id=${id}`);
  }, []);

  const handleCloseDetail = useCallback(() => {
    void navigate("/");
  }, []);

  const isDetailOpen = Boolean(selectedId);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Transaction History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Browse and search your recent wallet transactions.
        </p>
      </div>

      {/* During SSR (gatsby build) window is unavailable — render a static
          skeleton so the HTML shell is valid and Apollo only runs in-browser */}
      {!mounted ? (
        <LoadingSkeleton count={9} />
      ) : (
        <>
          <StatsBar />

          <SearchFilter
            onSearch={setSearchTerm}
            onFilterStatus={setStatusFilter}
            onFilterSpecies={setSpeciesFilter}
            onSortChange={setSortOrder}
            currentStatus={statusFilter}
            currentSpecies={speciesFilter}
            currentSort={sortOrder}
          />

          {loading && !characters.length ? (
            <LoadingSkeleton count={API_PAGE_SIZE} />
          ) : error ? (
            <ErrorState message={error.message} onRetry={refetch} />
          ) : isEmpty ? (
            <EmptyState message="No transactions match your search criteria." />
          ) : (
            <>
              <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {Math.min((currentPage - 1) * API_PAGE_SIZE + 1, totalItems)}–
                  {Math.min(currentPage * API_PAGE_SIZE, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {totalItems}
                </span>{" "}
                transactions
              </div>
              <TransactionList
                characters={characters}
                onCardClick={handleCardClick}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={API_PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          <TransactionDetail
            character={selectedCharacter}
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            loading={detailLoading}
            error={detailError ?? null}
          />
        </>
      )}
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>OKY Wallet — Transaction Explorer</title>
    <meta
      name="description"
      content="Browse your OKY Wallet transaction history."
    />
  </>
);
