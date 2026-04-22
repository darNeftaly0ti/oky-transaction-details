import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const httpLink = new HttpLink({
  uri:
    process.env.GATSBY_GRAPHQL_URI ?? "https://rickandmortyapi.com/graphql",
});

// Retry up to 4 times with exponential backoff + jitter.
// The Rick and Morty API is rate-limited by Cloudflare (Error 1015) when
// pages change rapidly. Retrying automatically hides transient failures
// from the user without requiring a manual "Try Again" click.
const retryLink = new RetryLink({
  delay: {
    initial: 800,   // wait 800ms before first retry
    max: 8000,      // cap at 8s between retries
    jitter: true,   // randomise slightly to avoid thundering herd
  },
  attempts: {
    max: 4,
    retryIf: (error) => {
      if (!error) return false;
      // Retry on network errors and rate-limit (429 / Cloudflare 1015)
      const msg: string = (error.message ?? "").toLowerCase();
      return (
        error.networkError != null ||
        msg.includes("networkerror") ||
        msg.includes("rate limit") ||
        msg.includes("429") ||
        msg.includes("1015")
      );
    },
  },
});

export const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
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
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
