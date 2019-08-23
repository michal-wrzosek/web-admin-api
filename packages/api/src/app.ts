import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { getApolloServer } from './apollo/apolloServer';

export const getApp = () => {
  const apolloServer = getApolloServer();

  const app = express();

  // Cookie parser
  app.use(cookieParser());

  // Body parsing
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  return app;
};
