import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { typeDefs, resolvers } from '@/app/api/graphql/route';

jest.mock('@/lib/prisma');

interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'ADMIN';
  };
}

interface DeleteMovementsData {
  deleteMovements: Movement[];
}

const schema = makeExecutableSchema({ typeDefs, resolvers });
let server: ApolloServer;

beforeAll(() => {
  server = new ApolloServer({ schema });
});

describe('Pruebas de la mutación deleteMovements', () => {
  it('debe eliminar movimientos y retornar los movimientos eliminados', async () => {
    const mutation = `
      mutation DeleteMovements($ids: [String!]!) {
        deleteMovements(ids: $ids) {
          id
          concept
          amount
          date
          user {
            id
            name
            email
            phone
            role
          }
        }
      }
    `;

    const variables = {
      ids: ['mov1'],
    };

    const response = await server.executeOperation(
      { query: mutation, variables },
      { contextValue: { auth: { user: { id: 'test', email: 'test@example.com' } } } }
    );

    expect(response.body.kind).toBe('single');
    const result =
      response.body.kind === 'single'
        ? response.body.singleResult
        : response.body.initialResult;
    expect(result.errors).toBeUndefined();

    if (!result.data) {
      throw new Error('No se recibió data en la respuesta');
    }

    const data = result.data as unknown as DeleteMovementsData;
    expect(data.deleteMovements).toBeInstanceOf(Array);
    expect(data.deleteMovements.length).toBeGreaterThan(0);
    expect(data.deleteMovements[0]).toHaveProperty('id', 'mov1');

    const { prisma } = require('@/lib/prisma');
    expect(prisma.movement.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.movement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: variables.ids } },
        include: { user: true },
      })
    );
    expect(prisma.movement.deleteMany).toHaveBeenCalledTimes(1);
    expect(prisma.movement.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: variables.ids } },
      })
    );
  });
});
