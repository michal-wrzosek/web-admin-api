import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { getApolloServer } from './apollo/apolloServer';
import { CORS_ORIGIN } from './configuration';

export const getApp = () => {
  const apolloServer = getApolloServer();

  const app = express();

  // Cookie parser
  app.use(cookieParser());

  // Body parsing
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: CORS_ORIGIN,
      credentials: true,
    },
  });

  return app;
};
