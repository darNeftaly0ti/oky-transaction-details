import React from "react";
import type { HeadFC } from "gatsby";
import Layout from "../components/Layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found</p>
        <a
          href="/"
          className="px-6 py-2 bg-oky-primary text-white rounded-lg hover:bg-oky-secondary transition-colors"
        >
          Go back home
        </a>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not Found — OKY Wallet</title>;
