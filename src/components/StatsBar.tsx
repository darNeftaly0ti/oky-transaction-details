import React from "react";
import { useLaunchStats } from "../hooks/useLaunchStats";

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  colorClass: string;
  loading: boolean;
}> = ({ label, value, sub, icon, colorClass, loading }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
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
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
      )}
    </div>
  </div>
);

const StatsBar: React.FC = () => {
  const { total, successful, failed, successRate, loading } = useLaunchStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard
        label="Total Launches"
        value={total}
        icon={
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
        colorClass="bg-blue-100 dark:bg-blue-900/30"
        loading={loading}
      />
      <StatCard
        label="Successful"
        value={successful}
        sub={`${successRate}% success rate`}
        icon={
          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        colorClass="bg-emerald-100 dark:bg-emerald-900/30"
        loading={loading}
      />
      <StatCard
        label="Failed"
        value={failed}
        icon={
          <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        colorClass="bg-rose-100 dark:bg-rose-900/30"
        loading={loading}
      />
      <StatCard
        label="Success Rate"
        value={`${successRate}%`}
        sub={`${successful} of ${total} missions`}
        icon={
          <svg className="w-6 h-6 text-oky-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        colorClass="bg-teal-100 dark:bg-teal-900/30"
        loading={loading}
      />
    </div>
  );
};

export default StatsBar;
