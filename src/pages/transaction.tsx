import React, { useEffect } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { navigate, Link } from "gatsby";
import Layout from "../components/Layout";
import { useCharacterDetail } from "../hooks/useCharacterDetail";
import type { CharacterStatus } from "../types/api";

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

const getStatusBadge = (status: CharacterStatus): string => {
  if (status === "Alive") return "bg-emerald-400/20 text-emerald-300";
  if (status === "Dead") return "bg-rose-400/20 text-rose-300";
  return "bg-white/10 text-white/60";
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
    <dt className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">
      {label}
    </dt>
    <dd className="text-sm text-slate-800 dark:text-slate-100 font-semibold">
      {value}
    </dd>
  </div>
);

const TransactionDetailPage: React.FC<PageProps> = ({ params }) => {
  const id = params.id as string | undefined;

  const { character, loading, error, fetchCharacter } = useCharacterDetail();

  useEffect(() => {
    if (id) {
      fetchCharacter(id);
    }
  }, [id, fetchCharacter]);

  if (!id) {
    void navigate("/");
    return null;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-oky-secondary hover:text-oky-primary
            transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-oky-secondary rounded"
          aria-label="Back to transaction list"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to transactions
        </Link>

        {loading && (
          <div
            aria-busy="true"
            aria-label="Loading transaction detail"
            className="space-y-4 animate-pulse"
          >
            <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Failed to load transaction
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {error.message}
            </p>
            <button
              onClick={() => id && fetchCharacter(id)}
              className="px-6 py-2.5 bg-oky-primary text-white text-sm font-medium rounded-lg
                hover:bg-oky-secondary transition-colors focus:outline-none focus:ring-2
                focus:ring-oky-secondary focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && character && (
          <article aria-labelledby="transaction-title">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
              <div className="bg-oky-dark px-6 py-8 flex flex-col sm:flex-row items-center gap-6">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={`${character.name} portrait`}
                    className="w-32 h-32 object-cover rounded-2xl flex-shrink-0 shadow-xl ring-4 ring-white/10"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white/40 text-sm">No image</span>
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h1
                    id="transaction-title"
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {character.name}
                  </h1>
                  <span
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusBadge(character.status)}`}
                  >
                    {character.status === "Alive"
                      ? "✓ Active"
                      : character.status === "Dead"
                        ? "✗ Closed"
                        : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                    Profile Info
                  </h2>
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                      label="Current Location"
                      value={character.location?.name ?? "Unknown"}
                    />
                    <InfoItem
                      label="Created"
                      value={formatDate(character.created)}
                    />
                  </dl>
                </div>

                {character.origin?.dimension && (
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Dimension Info
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Origin dimension:{" "}
                      <span className="font-medium">
                        {character.origin.dimension}
                      </span>
                      {character.location?.dimension &&
                        character.location.dimension !==
                          character.origin.dimension && (
                          <>
                            . Currently in:{" "}
                            <span className="font-medium">
                              {character.location.dimension}
                            </span>
                          </>
                        )}
                      .
                    </p>
                  </div>
                )}

                {character.episode && character.episode.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                      Appears in ({character.episode.length})
                    </h2>
                    <ul className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      {character.episode.map((ep) => (
                        <li
                          key={ep.id}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-xs text-oky-secondary bg-oky-secondary/10 px-2 py-0.5 rounded">
                              {ep.episode}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 truncate">
                              {ep.name}
                            </span>
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {ep.air_date}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        )}

        {!loading && !error && !character && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Transaction not found.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-oky-primary text-white text-sm font-medium rounded-lg
                hover:bg-oky-secondary transition-colors"
            >
              Go back
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailPage;

export const Head: HeadFC<object, { id?: string }> = () => (
  <title>Transaction Detail — OKY Wallet</title>
);
