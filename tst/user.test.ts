import assert from 'node:assert';
import { ApolloServer } from '@apollo/server';
import { UsersAPI } from '../src/datasources/users.js';
import { resolvers } from '../src/resolvers.js';

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

let server: ApolloServer;

beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
});

afterAll(async () => {
    await server.stop();
});

/** Returns a context value with a fresh UsersAPI instance. */
const ctx = () => ({ contextValue: { usersApi: new UsersAPI() } });

// ---------------------------------------------------------------------------
// Functional tests
// ---------------------------------------------------------------------------

describe('getUser', () => {
    it('returns the correct user for a valid ID', async () => {
        const { body } = await server.executeOperation(
            { query: `{ getUser(id: "1") { id name email age } }` },
            ctx()
        );
        assert(body.kind === 'single');
        expect(body.singleResult.errors).toBeUndefined();
        expect(body.singleResult.data?.getUser).toEqual({
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            age: 30,
        });
    });

    it('returns null for a non-existent user ID', async () => {
        const { body } = await server.executeOperation(
            { query: `{ getUser(id: "999") { id name } }` },
            ctx()
        );
        assert(body.kind === 'single');
        expect(body.singleResult.errors).toBeUndefined();
        expect(body.singleResult.data?.getUser).toBeNull();
    });
});

describe('listUsers', () => {
    it('returns all users when no limit is provided', async () => {
        const { body } = await server.executeOperation(
            { query: `{ listUsers { id name email age } }` },
            ctx()
        );
        assert(body.kind === 'single');
        expect(body.singleResult.errors).toBeUndefined();
        const users = body.singleResult.data?.listUsers as unknown[];
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(3);
    });

    it('returns the correct number of users when limit is specified', async () => {
        const { body } = await server.executeOperation(
            { query: `{ listUsers(limit: 2) { id name } }` },
            ctx()
        );
        assert(body.kind === 'single');
        expect(body.singleResult.errors).toBeUndefined();
        const users = body.singleResult.data?.listUsers as unknown[];
        expect(users).toHaveLength(2);
    });
});

// ---------------------------------------------------------------------------
// Performance test
// ---------------------------------------------------------------------------

describe('Performance', () => {
    it('resolves getUser within 100ms', async () => {
        const start = performance.now();
        await server.executeOperation(
            { query: `{ getUser(id: "1") { id name } }` },
            ctx()
        );
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(100);
    });
});

// ---------------------------------------------------------------------------
// Security test
// ---------------------------------------------------------------------------

describe('Security', () => {
    it('returns a validation error when querying a non-existent field', async () => {
        const { body } = await server.executeOperation(
            { query: `{ getUser(id: "1") { id password } }` },
            ctx()
        );
        assert(body.kind === 'single');
        expect(body.singleResult.errors).toBeDefined();
        expect(body.singleResult.errors!.length).toBeGreaterThan(0);
        expect(body.singleResult.errors![0].message).toMatch(/password/i);
    });
});
