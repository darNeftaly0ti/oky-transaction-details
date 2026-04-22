import React from "react";
import type { Character, CharacterStatus } from "../types/api";

interface TransactionCardProps {
  character: Character;
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
  status: CharacterStatus
): { label: string; className: string } => {
  if (status === "Alive")
    return {
      label: "Alive",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
    };
  if (status === "Dead")
    return {
      label: "Dead",
      className:
        "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400",
    };
  return {
    label: "Unknown",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  };
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  character,
  onClick,
}) => {
  const status = getStatusConfig(character.status);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(character.id);
    }
  };

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={() => onClick(character.id)}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm
        border border-slate-200 dark:border-slate-700 p-4 cursor-pointer
        hover:shadow-md hover:border-oky-secondary dark:hover:border-oky-secondary
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
        dark:focus:ring-offset-slate-900"
      aria-label={`Transaction: ${character.name}`}
    >
      <div className="flex items-start gap-3">
        {character.image ? (
          <img
            src={character.image}
            alt={`${character.name} avatar`}
            loading="lazy"
            className="w-14 h-14 object-cover rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-slate-400 text-xs font-medium">N/A</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">
              {character.name}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {formatDate(character.created)}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {character.species}
            </span>
            {character.gender && character.gender !== "unknown" && (
              <span className="text-slate-400 dark:text-slate-500">
                · {character.gender}
              </span>
            )}
          </div>

          {character.origin?.name && character.origin.name !== "unknown" && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
              Origin: {character.origin.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
