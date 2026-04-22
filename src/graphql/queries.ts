import { gql } from "@apollo/client";

/**
 * Rick and Morty GraphQL API — https://rickandmortyapi.com/graphql
 *
 * Each "character" is displayed as a "transaction" in the OKY Wallet UI.
 * The API returns 20 results per page natively, and `info` carries the
 * pagination metadata (count, pages, next, prev).
 */

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
        created
        origin {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      created
      origin {
        id
        name
        dimension
        type
      }
      location {
        id
        name
        dimension
        type
      }
      episode {
        id
        name
        episode
        air_date
      }
    }
  }
`;

/**
 * We fetch three parallel counts using GraphQL aliases — total, alive, dead —
 * so we can build a stats dashboard with a single round-trip.
 */
export const GET_STATS = gql`
  query GetStats {
    total: characters {
      info {
        count
      }
    }
    alive: characters(filter: { status: "alive" }) {
      info {
        count
      }
    }
    dead: characters(filter: { status: "dead" }) {
      info {
        count
      }
    }
  }
`;
