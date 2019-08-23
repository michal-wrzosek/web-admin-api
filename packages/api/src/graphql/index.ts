import { gql } from 'apollo-server-express';

import { userResolvers } from './user';

export const typeDefs = gql`
  # ##########
  # TYPES
  # ##########
  type User {
    id: ID!
    email: String!
  }

  # ##########
  # INPUTS
  # ##########
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  # ##########
  # QUERIES
  # ##########
  type Query {
    me: User!
    users: [User!]!
  }

  # ##########
  # MUTATIONS
  # ##########
  type Mutation {
    login(loginInput: LoginInput): User!
    logout: Boolean!
    register(registerInput: RegisterInput): User!
  }
`;

export const resolvers = {
  Query: {
    me: userResolvers.Query.me,
    users: userResolvers.Query.users,
  },
  Mutation: {
    login: userResolvers.Mutation.login,
    logout: userResolvers.Mutation.logout,
    register: userResolvers.Mutation.register,
  },
};
