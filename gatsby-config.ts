import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "OKY Wallet — Transaction Explorer",
    description:
      "A mini-application simulating a digital wallet transaction history powered by the public Rick and Morty GraphQL API.",
    siteUrl: "https://oky-wallet-explorer.netlify.app",
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-postcss",
    "gatsby-plugin-netlify",
  ],
};

export default config;
