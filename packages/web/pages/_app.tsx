import React from 'react';
import App, { Container, AppContext, AppInitialProps } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';
import getConfig from 'next/config';

import withApollo from 'src/lib/withApollo';
import { GlobalConfigurationProvider, GlobalConfigurationContextType } from 'src/context/GlobalConfigurationContext';
import { ThemeProvider } from 'src/styles/styledComponents';
import theme from 'src/styles/theme';
import { GlobalStyles } from 'src/styles/globalStyles';

const { publicRuntimeConfig } = getConfig();
const { GRAPHQL_URL } = publicRuntimeConfig;

export interface MyAppProps {
  apollo: ApolloClient<any>;
}

class MyApp extends App<MyAppProps> {
  static async getInitialProps({ ctx, Component }: AppContext): Promise<AppInitialProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const globalConfiguration: GlobalConfigurationContextType = {
      GRAPHQL_URL,
    };

    return {
      pageProps: { ...pageProps, globalConfiguration },
    };
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <GlobalConfigurationProvider value={pageProps.globalConfiguration}>
            <ThemeProvider theme={theme}>
              <React.Fragment>
                <GlobalStyles />
                <Component {...pageProps} />
              </React.Fragment>
            </ThemeProvider>
          </GlobalConfigurationProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo({ uri: GRAPHQL_URL })(MyApp);
