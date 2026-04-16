// The ApolloServer constructor requires two parameters: your schema

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { UsersAPI } from "./datasources/users.js";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./schema.js";

// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});

const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => ({
        usersApi: new UsersAPI(),
    }),
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);