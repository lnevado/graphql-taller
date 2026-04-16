// The ApolloServer constructor requires two parameters: your schema

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { UsersAPI } from "./datasources/users.js";
import { resolvers } from "./resolvers.js";

const typeDefs = `#graphql

  type User {
        id: ID!
        name: String!
        email: String!
        age: Int
  }

  type Query {
    getUser(id: ID!): User
    listUsers(limit: Int): [User!]!
  }
`;

// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => ({
        usersApi: new UsersAPI(),
    }),
    listen: { port: 4000 },
    // context: async ({ req }) => {
    //     return {
    //         dataSources: {
    //             users: new UsersAPI(),
    //         },
    //         token: req.headers.authorization,
    //     };
    // }
});

console.log(`🚀  Server ready at: ${url}`);