import React from "react";
import type { Launch } from "../types/api";

interface TransactionCardProps {
  launch: Launch;
  onClick: (id: string) => void;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusConfig = (
  success: boolean | null
): { label: string; className: string } => {
  if (success === true)
    return { label: "Success", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400" };
  if (success === false)
    return { label: "Failed", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400" };
  return { label: "Pending", className: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400" };
};

const TransactionCard: React.FC<TransactionCardProps> = ({ launch, onClick }) => {
  const status = getStatusConfig(launch.launch_success);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(launch.id);
    }
  };

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={() => onClick(launch.id)}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm
        border border-slate-200 dark:border-slate-700 p-4 cursor-pointer
        hover:shadow-md hover:border-oky-secondary dark:hover:border-oky-secondary
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
        dark:focus:ring-offset-slate-900"
      aria-label={`Transaction: ${launch.mission_name}`}
    >
      <div className="flex items-start gap-3">
        {launch.links?.mission_patch_small ? (
          <img
            src={launch.links.mission_patch_small}
            alt={`${launch.mission_name} patch`}
            className="w-12 h-12 object-contain rounded-lg bg-slate-100 dark:bg-slate-700 p-1 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-slate-400 text-xs font-medium">N/A</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">
              {launch.mission_name}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.className}`}>
              {status.label}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {formatDate(launch.launch_date_local)}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {launch.rocket?.rocket_name ?? "Unknown"}
            </span>
            {launch.rocket?.rocket_type && (
              <span className="text-slate-400 dark:text-slate-500">({launch.rocket.rocket_type})</span>
            )}
          </div>

          {launch.details && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {launch.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
