export const typeDefs = `#graphql

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
