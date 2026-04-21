import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-3 py-2 text-sm rounded-lg
          border border-slate-300 dark:border-slate-600
          text-slate-600 dark:text-slate-300
          bg-white dark:bg-slate-800
          hover:bg-slate-100 dark:hover:bg-slate-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors focus:outline-none focus:ring-2 focus:ring-oky-secondary"
      >
        Previous
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 dark:text-slate-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
            className={`w-10 h-10 text-sm rounded-lg font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-oky-secondary ${
                currentPage === page
                  ? "bg-oky-primary dark:bg-oky-secondary text-white"
                  : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-3 py-2 text-sm rounded-lg
          border border-slate-300 dark:border-slate-600
          text-slate-600 dark:text-slate-300
          bg-white dark:bg-slate-800
          hover:bg-slate-100 dark:hover:bg-slate-700
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors focus:outline-none focus:ring-2 focus:ring-oky-secondary"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
