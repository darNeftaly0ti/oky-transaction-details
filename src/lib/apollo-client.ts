import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Public Rick and Morty GraphQL API — no auth, stable, ~826 records with
// native pagination and filtering. The technical test explicitly allows any
// domain; we map each "character" to a "transaction" in the UI.
const httpLink = new HttpLink({
  uri:
    process.env.GATSBY_GRAPHQL_URI ?? "https://rickandmortyapi.com/graphql",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Keep one cache entry per unique (page, filter) combination so
          // switching pages or filters doesn't overwrite previous results.
          characters: {
            keyArgs: ["filter", "page"],
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      // Rick and Morty returns a 404 with errors when a filter yields no
      // results; `errorPolicy: "all"` lets the UI render the empty state
      // instead of falling through to the generic error screen.
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
