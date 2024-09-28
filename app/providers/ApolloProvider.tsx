"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { initializeApollo } from "../../lib/apollo-client";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = initializeApollo(null);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
