import React, { useState, useEffect } from "react";
import type { SortOrder } from "../hooks/useCharacters";

const SPECIES_OPTIONS = [
  { label: "All species", value: "" },
  { label: "Human", value: "Human" },
  { label: "Alien", value: "Alien" },
  { label: "Humanoid", value: "Humanoid" },
  { label: "Robot", value: "Robot" },
  { label: "Animal", value: "Animal" },
  { label: "Mythological", value: "Mythological Creature" },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Alive", value: "alive" },
  { label: "Dead", value: "dead" },
  { label: "Unknown", value: "unknown" },
];

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onFilterStatus: (value: string) => void;
  onFilterSpecies: (value: string) => void;
  onSortChange: (order: SortOrder) => void;
  currentStatus: string;
  currentSpecies: string;
  currentSort: SortOrder;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterStatus,
  onFilterSpecies,
  onSortChange,
  currentStatus,
  currentSpecies,
  currentSort,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  const chips: { label: string; onRemove: () => void }[] = [];
  if (inputValue)
    chips.push({
      label: `Name: "${inputValue}"`,
      onRemove: () => setInputValue(""),
    });
  if (currentStatus)
    chips.push({
      label: `Status: ${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}`,
      onRemove: () => onFilterStatus(""),
    });
  if (currentSpecies)
    chips.push({
      label: `Species: ${currentSpecies}`,
      onRemove: () => onFilterSpecies(""),
    });

  return (
    <div
      role="search"
      aria-label="Filter transactions"
      className="mb-6 space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search transactions
          </label>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search by name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600
              rounded-lg text-sm bg-white dark:bg-slate-800
              text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:border-transparent
              transition-all"
          />
        </div>

        <button
          onClick={() =>
            onSortChange(currentSort === "newest" ? "oldest" : "newest")
          }
          aria-label={`Sort by date: currently ${currentSort} first`}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-800
            text-slate-600 dark:text-slate-300
            hover:bg-slate-50 dark:hover:bg-slate-700
            transition-colors focus:outline-none focus:ring-2 focus:ring-oky-secondary
            whitespace-nowrap"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          {currentSort === "newest" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onFilterStatus(opt.value)}
              aria-pressed={currentStatus === opt.value}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-oky-secondary ${
                  currentStatus === opt.value
                    ? "bg-oky-primary dark:bg-oky-secondary text-white"
                    : "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <label htmlFor="species-filter" className="sr-only">
            Filter by species
          </label>
          <select
            id="species-filter"
            value={currentSpecies}
            onChange={(e) => onFilterSpecies(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 text-sm font-medium rounded-lg
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-slate-600 dark:text-slate-300
              hover:bg-slate-50 dark:hover:bg-slate-700
              focus:outline-none focus:ring-2 focus:ring-oky-secondary
              transition-colors cursor-pointer"
          >
            {SPECIES_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>

      {chips.length > 0 && (
        <div
          className="flex flex-wrap gap-2 items-center"
          aria-label="Active filters"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active filters:
          </span>
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 text-xs font-medium
                bg-oky-primary/10 dark:bg-oky-secondary/20
                text-oky-primary dark:text-oky-secondary
                border border-oky-primary/20 dark:border-oky-secondary/30
                rounded-full"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                aria-label={`Remove filter: ${chip.label}`}
                className="w-4 h-4 rounded-full hover:bg-oky-primary/20 dark:hover:bg-oky-secondary/30
                  flex items-center justify-center transition-colors focus:outline-none"
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setInputValue("");
              onFilterStatus("");
              onFilterSpecies("");
            }}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400
              transition-colors underline focus:outline-none"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
