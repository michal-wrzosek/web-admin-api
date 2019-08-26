import withApollo from 'next-with-apollo';
import ApolloClient, { InMemoryCache } from 'apollo-boost';

export default ({ uri }: { uri: string }) =>
  withApollo(
    props =>
      new ApolloClient({
        uri,
        cache: new InMemoryCache().restore(props.initialState || {}),
        credentials: 'include',
        ...(props.ctx && props.ctx.req
          ? {
              headers: {
                cookie: props.ctx.req.headers['cookie'],
              },
            }
          : {}),
      }),
    { getDataFromTree: 'ssr' },
  );
