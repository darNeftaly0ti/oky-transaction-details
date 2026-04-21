import React from "react";
import type { GatsbyBrowser } from "gatsby";
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/lib/apollo-client";
import "./src/styles/global.css";

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({
  element,
}) => {
  return <ApolloProvider client={client}>{element}</ApolloProvider>;
};
