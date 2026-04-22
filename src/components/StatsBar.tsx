import React from "react";
import { useCharacterStats } from "../hooks/useCharacterStats";

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  colorClass: string;
  loading: boolean;
}> = ({ label, value, sub, icon, colorClass, loading }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mb-0.5">
        {label}
      </p>
      {loading ? (
        <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">
          {value}
        </p>
      )}
      {sub && !loading && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {sub}
        </p>
      )}
    </div>
  </div>
);

const StatsBar: React.FC = () => {
  const { total, alive, dead, aliveRate, loading } = useCharacterStats();
  const unknown = Math.max(total - alive - dead, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard
        label="Total Transactions"
        value={total}
        icon={
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
        colorClass="bg-blue-100 dark:bg-blue-900/30"
        loading={loading}
      />
      <StatCard
        label="Active"
        value={alive}
        sub={`${aliveRate}% of total`}
        icon={
          <svg
            className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        colorClass="bg-emerald-100 dark:bg-emerald-900/30"
        loading={loading}
      />
      <StatCard
        label="Closed"
        value={dead}
        icon={
          <svg
            className="w-6 h-6 text-rose-600 dark:text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        colorClass="bg-rose-100 dark:bg-rose-900/30"
        loading={loading}
      />
      <StatCard
        label="Unknown"
        value={unknown}
        sub={`${total > 0 ? Math.round((unknown / total) * 100) : 0}% of total`}
        icon={
          <svg
            className="w-6 h-6 text-oky-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        colorClass="bg-teal-100 dark:bg-teal-900/30"
        loading={loading}
      />
    </div>
  );
};

export default StatsBar;
