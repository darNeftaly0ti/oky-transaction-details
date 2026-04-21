import React from "react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-rose-500 dark:text-rose-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-oky-primary dark:bg-oky-secondary text-white text-sm font-medium
          rounded-lg hover:bg-oky-secondary transition-colors
          focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
          dark:focus:ring-offset-slate-900"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
