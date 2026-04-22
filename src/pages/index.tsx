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

// All Apollo hooks live here — never called during SSR.
const IndexContent: React.FC<{ selectedId: string | null }> = ({
  selectedId,
}) => {
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

  const handleCardClick = useCallback(
    (id: string) => void navigate(`/?id=${id}`),
    []
  );
  const handleCloseDetail = useCallback(() => void navigate("/"), []);
  const isDetailOpen = Boolean(selectedId);

  return (
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
        // key forces a re-mount (and therefore the fade-in animation) whenever
        // the page or filter changes, giving the user visual feedback that new
        // data has arrived even when the skeleton is too fast to notice.
        <div key={`${currentPage}-${totalItems}`} className="animate-fade-in">
          <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
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
            </span>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-oky-secondary">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Updating…
              </span>
            )}
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
        </div>
      )}

      <TransactionDetail
        character={selectedCharacter}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        loading={detailLoading}
        error={detailError ?? null}
      />
    </>
  );
};

// Shell — safe for SSR. Apollo hooks only run inside IndexContent.
const IndexPage: React.FC<PageProps> = ({ location }) => {
  const selectedId = new URLSearchParams(location.search).get("id");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

      {mounted ? (
        <IndexContent selectedId={selectedId} />
      ) : (
        <LoadingSkeleton count={9} />
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
