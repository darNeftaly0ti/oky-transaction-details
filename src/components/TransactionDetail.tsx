import React, { useEffect, useRef } from "react";
import { Link } from "gatsby";
import type { Character, CharacterStatus } from "../types/api";

interface TransactionDetailProps {
  character: Character | null;
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

const getStatusStyles = (status: CharacterStatus): string => {
  if (status === "Alive")
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400";
  if (status === "Dead")
    return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <dt className="text-xs text-slate-500 dark:text-slate-400 font-medium">
      {label}
    </dt>
    <dd className="text-sm text-slate-800 dark:text-slate-100 mt-0.5">
      {value}
    </dd>
  </div>
);

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  character,
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

  const episodes = character?.episode ?? [];

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
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2
            id="detail-title"
            className="text-lg font-bold text-slate-800 dark:text-slate-100"
          >
            Transaction Detail
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-oky-secondary"
          >
            <svg
              className="w-5 h-5 text-slate-500 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-rose-600 dark:text-rose-400 mb-2">
                Failed to load details
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {error.message}
              </p>
            </div>
          )}

          {!loading && !error && character && (
            <div className="space-y-6">
              <div className="flex justify-center">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={`${character.name} portrait`}
                    className="w-40 h-40 object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                    <span className="text-slate-400 dark:text-slate-500 text-sm">
                      No image
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {character.name}
                </h3>
                <span
                  className={`inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full ${getStatusStyles(character.status)}`}
                >
                  {character.status}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-4">
                <InfoItem label="Species" value={character.species} />
                <InfoItem label="Gender" value={character.gender} />
                {character.type && (
                  <InfoItem label="Type" value={character.type} />
                )}
                <InfoItem
                  label="Origin"
                  value={character.origin?.name ?? "Unknown"}
                />
                <InfoItem
                  label="Last Location"
                  value={character.location?.name ?? "Unknown"}
                />
                <InfoItem label="Created" value={formatDate(character.created)} />
              </dl>

              {episodes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Appears in ({episodes.length}{" "}
                    {episodes.length === 1 ? "episode" : "episodes"})
                  </h4>
                  <ul className="max-h-48 overflow-y-auto space-y-1 text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    {episodes.slice(0, 20).map((ep) => (
                      <li
                        key={ep.id}
                        className="flex justify-between gap-2 truncate"
                      >
                        <span className="truncate">
                          <span className="font-mono text-xs text-oky-secondary mr-2">
                            {ep.episode}
                          </span>
                          {ep.name}
                        </span>
                      </li>
                    ))}
                    {episodes.length > 20 && (
                      <li className="text-xs text-slate-400 italic pt-1">
                        …and {episodes.length - 20} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to={`/transaction/${character.id}`}
                  className="text-center py-2 px-4 bg-oky-primary dark:bg-oky-secondary text-white rounded-lg
                    text-sm font-medium hover:bg-oky-secondary dark:hover:bg-oky-primary transition-colors
                    focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
                    dark:focus:ring-offset-slate-800"
                >
                  View Full Detail Page →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
