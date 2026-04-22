import React, { useEffect, useState } from "react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const isRateLimit = (msg: string): boolean => {
  const lower = msg.toLowerCase();
  return (
    lower.includes("rate limit") ||
    lower.includes("1015") ||
    lower.includes("429") ||
    lower.includes("too many") ||
    lower.includes("networkerror")
  );
};

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const rateLimit = isRateLimit(message);

  // Auto-retry countdown for rate limit errors
  const [countdown, setCountdown] = useState(rateLimit ? 10 : 0);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!rateLimit) return;
    setCountdown(10);
    setRetrying(false);
  }, [message, rateLimit]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && rateLimit && !retrying) {
      setRetrying(true);
      onRetry();
    }
  }, [countdown, rateLimit, retrying, onRetry]);

  const handleManualRetry = () => {
    setCountdown(0);
    setRetrying(false);
    onRetry();
  };

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          rateLimit
            ? "bg-amber-100 dark:bg-amber-900/30"
            : "bg-rose-100 dark:bg-rose-900/30"
        }`}
      >
        {rateLimit ? (
          <svg
            className="w-8 h-8 text-amber-500 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-rose-500 dark:text-rose-400"
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
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {rateLimit ? "Too many requests" : "Something went wrong"}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 max-w-xs">
        {rateLimit
          ? "The API is temporarily rate-limiting us. Retrying automatically…"
          : message}
      </p>

      {rateLimit && countdown > 0 && (
        <div className="mb-5 flex flex-col items-center gap-2">
          <div className="text-3xl font-bold tabular-nums text-amber-500 dark:text-amber-400">
            {countdown}
          </div>
          {/* Progress ring */}
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={100 - (countdown / 10) * 100}
              strokeLinecap="round"
              className="text-amber-500 dark:text-amber-400 transition-all duration-1000"
            />
          </svg>
        </div>
      )}

      {rateLimit && countdown === 0 && retrying && (
        <div className="mb-5 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Retrying…
        </div>
      )}

      <button
        onClick={handleManualRetry}
        className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            rateLimit
              ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
              : "bg-oky-primary hover:bg-oky-secondary focus:ring-oky-secondary"
          }`}
      >
        {countdown > 0 ? "Retry now" : "Try Again"}
      </button>
    </div>
  );
};

export default ErrorState;
