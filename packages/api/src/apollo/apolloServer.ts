import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, NODE_ENV } from 'src/configuration';
import { typeDefs, resolvers } from 'src/graphql';
import { NODE_ENVS } from 'src/types/NodeEnvs';
import { ApolloContext, UserData } from 'src/types/ApolloContext';

export const getApolloServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }): ApolloContext => {
      try {
        const { authorization } = req.cookies;
        const token = authorization.split('Bearer ')[1];

        const userData = jwt.verify(token, JWT_SECRET) as UserData;
        return { req, res, userData };
      } catch (err) {
        return { req, res, userData: undefined };
      }
    },
    playground:
      NODE_ENV === NODE_ENVS.DEVELOPMENT
        ? {
            settings: {
              'request.credentials': 'include',
            },
          }
        : false,
  });
