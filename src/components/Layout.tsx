import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

interface LayoutProps {
  children: React.ReactNode;
}

const SunIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-oky-dark dark:bg-slate-950 text-white shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-oky-accent rounded-lg flex items-center justify-center font-bold text-oky-dark text-lg select-none">
              OK
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">OKY Wallet</p>
              <p className="text-xs text-slate-400">Transaction Explorer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10
                transition-colors focus:outline-none focus:ring-2 focus:ring-oky-accent"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <span className="text-sm text-slate-400">v1.0</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-oky-dark dark:bg-slate-950 text-slate-400 text-center py-4 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} OKY Wallet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
