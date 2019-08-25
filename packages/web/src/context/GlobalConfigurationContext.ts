import React from 'react';

export type GlobalConfigurationContextType = {
  GRAPHQL_URL: string;
};

export const GlobalConfigurationContext = React.createContext<GlobalConfigurationContextType>(
  {} as GlobalConfigurationContextType,
);

export const GlobalConfigurationProvider = GlobalConfigurationContext.Provider;
