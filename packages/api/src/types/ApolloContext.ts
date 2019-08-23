import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export type UserData = {
  _id: string;
  email: string;
};

export type ApolloContext = ExpressContext & {
  userData?: UserData;
};
