// ApolloProvider is intentionally omitted from SSR — all data fetching in
// this app happens client-side. Adding ApolloProvider here causes Apollo's
// useRenderGuard to access `window` during gatsby build, breaking the build.
// The provider is registered only in gatsby-browser.tsx (browser runtime).
export {};
