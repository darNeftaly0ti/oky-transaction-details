import React, { useEffect, useCallback } from "react";
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
import { useLaunches } from "../hooks/useLaunches";
import { useLaunchDetail } from "../hooks/useLaunchDetail";

const PAGE_SIZE = 9;

const IndexPage: React.FC<PageProps> = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const selectedId = params.get("id");

  const {
    launches,
    loading,
    error,
    isEmpty,
    currentPage,
    totalItems,
    successFilter,
    rocketFilter,
    sortOrder,
    setCurrentPage,
    setSearchTerm,
    setSuccessFilter,
    setRocketFilter,
    setSortOrder,
    refetch,
  } = useLaunches({ pageSize: PAGE_SIZE });

  const {
    launch: selectedLaunch,
    loading: detailLoading,
    error: detailError,
    fetchLaunch,
    clearLaunch,
  } = useLaunchDetail();

  useEffect(() => {
    if (selectedId) {
      fetchLaunch(selectedId);
    } else {
      clearLaunch();
    }
  }, [selectedId, fetchLaunch, clearLaunch]);

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

      <StatsBar />

      <SearchFilter
        onSearch={setSearchTerm}
        onFilterSuccess={setSuccessFilter}
        onFilterRocket={setRocketFilter}
        onSortChange={setSortOrder}
        currentFilter={successFilter}
        currentRocket={rocketFilter}
        currentSort={sortOrder}
      />

      {loading && !launches.length ? (
        <LoadingSkeleton count={PAGE_SIZE} />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isEmpty ? (
        <EmptyState message="No transactions match your search criteria." />
      ) : (
        <>
          <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalItems)}–
              {Math.min(currentPage * PAGE_SIZE, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {totalItems}
            </span>{" "}
            transactions
          </div>
          <TransactionList launches={launches} onCardClick={handleCardClick} />
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <TransactionDetail
        launch={selectedLaunch}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        loading={detailLoading}
        error={detailError ?? null}
      />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>OKY Wallet — Transaction Explorer</title>
    <meta name="description" content="Browse your OKY Wallet transaction history." />
  </>
);
