import React, { useEffect } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { navigate, Link } from "gatsby";
import Layout from "../components/Layout";
import { useLaunchDetail } from "../hooks/useLaunchDetail";

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

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
    <dt className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">{label}</dt>
    <dd className="text-sm text-slate-800 dark:text-slate-100 font-semibold">{value}</dd>
  </div>
);

const LaunchDetailPage: React.FC<PageProps> = ({ params }) => {
  const id = params.id as string | undefined;

  const { launch, loading, error, fetchLaunch } = useLaunchDetail();

  useEffect(() => {
    if (id) {
      fetchLaunch(id);
    }
  }, [id, fetchLaunch]);

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
            <div className="h-48 bg-slate-200 rounded-2xl" />
            <div className="h-8 bg-slate-200 rounded w-2/3" />
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
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
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Failed to load transaction
            </h2>
            <p className="text-sm text-slate-500 mb-6">{error.message}</p>
            <button
              onClick={() => id && fetchLaunch(id)}
              className="px-6 py-2.5 bg-oky-primary text-white text-sm font-medium rounded-lg
                hover:bg-oky-secondary transition-colors focus:outline-none focus:ring-2
                focus:ring-oky-secondary focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && launch && (
          <article aria-labelledby="launch-title">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
              <div className="bg-oky-dark px-6 py-8 flex flex-col sm:flex-row items-center gap-6">
                {launch.links?.mission_patch ? (
                  <img
                    src={launch.links.mission_patch}
                    alt={`${launch.mission_name} mission patch`}
                    className="w-32 h-32 object-contain flex-shrink-0"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white/40 text-sm">No patch</span>
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h1
                    id="launch-title"
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {launch.mission_name}
                  </h1>
                  <span
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                      launch.launch_success === true
                        ? "bg-emerald-400/20 text-emerald-300"
                        : launch.launch_success === false
                          ? "bg-rose-400/20 text-rose-300"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    {launch.launch_success === true
                      ? "✓ Successful Launch"
                      : launch.launch_success === false
                        ? "✗ Failed Launch"
                        : "Pending"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {launch.details && (
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Mission Details
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {launch.details}
                    </p>
                  </div>
                )}

                <div>
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                      Mission Info
                    </h2>
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoItem
                      label="Date"
                      value={formatDate(launch.launch_date_local)}
                    />
                    <InfoItem
                      label="Launch Site"
                      value={launch.launch_site?.site_name_long ?? "Unknown"}
                    />
                    <InfoItem
                      label="Rocket"
                      value={launch.rocket?.rocket_name ?? "Unknown"}
                    />
                    <InfoItem
                      label="Rocket Type"
                      value={launch.rocket?.rocket_type ?? "Unknown"}
                    />
                    {launch.rocket?.rocket?.cost_per_launch != null && (
                      <InfoItem
                        label="Cost per Launch"
                        value={formatCurrency(
                          launch.rocket.rocket.cost_per_launch
                        )}
                      />
                    )}
                    {launch.rocket?.rocket?.first_flight && (
                      <InfoItem
                        label="First Flight"
                        value={launch.rocket.rocket.first_flight}
                      />
                    )}
                  </dl>
                </div>

                {launch.rocket?.rocket?.description && (
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Rocket Info
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {launch.rocket.rocket.description}
                    </p>
                  </div>
                )}

                {launch.links?.flickr_images &&
                  launch.links.flickr_images.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
                        Gallery
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

                <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  {launch.links?.article_link && (
                    <a
                      href={launch.links.article_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-4 bg-oky-primary dark:bg-oky-secondary text-white rounded-lg
                        text-sm font-medium hover:bg-oky-secondary dark:hover:bg-oky-primary transition-colors
                        focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
                        dark:focus:ring-offset-slate-800"
                    >
                      Read Article
                    </a>
                  )}
                  {launch.links?.video_link && (
                    <a
                      href={launch.links.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-4 border border-oky-primary dark:border-oky-secondary
                        text-oky-primary dark:text-oky-secondary rounded-lg text-sm font-medium
                        hover:bg-oky-primary dark:hover:bg-oky-secondary hover:text-white transition-colors
                        focus:outline-none focus:ring-2 focus:ring-oky-secondary focus:ring-offset-2
                        dark:focus:ring-offset-slate-800"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        )}

        {!loading && !error && !launch && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-500 mb-4">Transaction not found.</p>
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

export default LaunchDetailPage;

export const Head: HeadFC<object, { id?: string }> = () => (
  <title>Transaction Detail — OKY Wallet</title>
);
