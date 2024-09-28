import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { useApollo } from "../lib/apollo-client";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient: ApolloClient<NormalizedCacheObject> = useApollo(
    pageProps.initialApolloState
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
