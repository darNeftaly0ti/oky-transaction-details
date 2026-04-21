import React, { useEffect, useRef } from "react";
import { Link } from "gatsby";
import type { Launch } from "../types/api";

interface TransactionDetailProps {
  launch: Launch | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: Error | null;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</dt>
    <dd className="text-sm text-slate-800 dark:text-slate-100 mt-0.5">{value}</dd>
  </div>
);

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  launch,
  isOpen,
  onClose,
  loading,
  error,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 id="detail-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Transaction Detail
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-oky-secondary"
          >
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-rose-600 dark:text-rose-400 mb-2">Failed to load details</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
            </div>
          )}

          {!loading && !error && launch && (
            <div className="space-y-6">
              <div className="flex justify-center">
                {launch.links?.mission_patch ? (
                  <img
                    src={launch.links.mission_patch}
                    alt={`${launch.mission_name} mission patch`}
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <span className="text-slate-400 dark:text-slate-500 text-sm">No patch</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {launch.mission_name}
                </h3>
                <span className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full ${
                  launch.launch_success === true
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
                    : launch.launch_success === false
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}>
                  {launch.launch_success === true ? "Successful" : launch.launch_success === false ? "Failed" : "Pending"}
                </span>
              </div>

              {launch.details && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{launch.details}</p>
                </div>
              )}

              <dl className="grid grid-cols-2 gap-4">
                <InfoItem label="Date" value={formatDate(launch.launch_date_local)} />
                <InfoItem label="Launch Site" value={launch.launch_site?.site_name_long ?? "Unknown"} />
                <InfoItem label="Rocket" value={launch.rocket?.rocket_name ?? "Unknown"} />
                <InfoItem label="Rocket Type" value={launch.rocket?.rocket_type ?? "Unknown"} />
                {launch.rocket?.rocket?.cost_per_launch != null && (
                  <InfoItem label="Cost per Launch" value={formatCurrency(launch.rocket.rocket.cost_per_launch)} />
                )}
                {launch.rocket?.rocket?.first_flight && (
                  <InfoItem label="First Flight" value={launch.rocket.rocket.first_flight} />
                )}
              </dl>

              {launch.rocket?.rocket?.description && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rocket Info</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {launch.rocket.rocket.description}
                  </p>
                </div>
              )}

              {launch.links?.flickr_images && launch.links.flickr_images.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gallery</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {launch.links.flickr_images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${launch.mission_name} photo ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to={`/launch/${launch.id}`}
                  className="text-center py-2 px-4 bg-oky-primary dark:bg-oky-secondary text-white rounded-lg
                    text-sm font-medium hover:bg-oky-secondary dark:hover:bg-oky-primary transition-colors
                    focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
                    dark:focus:ring-offset-slate-800"
                >
                  View Full Detail Page →
                </Link>
                <div className="flex gap-3">
                  {launch.links?.article_link && (
                    <a
                      href={launch.links.article_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-4 border border-slate-300 dark:border-slate-600
                        text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium
                        hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors
                        focus:outline-none focus:ring-2 focus:ring-oky-secondary"
                    >
                      Read Article
                    </a>
                  )}
                  {launch.links?.video_link && (
                    <a
                      href={launch.links.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-4 border border-slate-300 dark:border-slate-600
                        text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium
                        hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors
                        focus:outline-none focus:ring-2 focus:ring-oky-secondary"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
