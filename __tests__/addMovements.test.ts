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

interface AddMovementData {
  addMovement: Movement;
}

const schema = makeExecutableSchema({ typeDefs, resolvers });
let server: ApolloServer;

beforeAll(() => {
  server = new ApolloServer({ schema });
});

describe('Pruebas de la mutación addMovement', () => {
  it('debe agregar un movimiento y retornar el movimiento creado', async () => {
    const mutation = `
      mutation AddMovement($concept: String!, $amount: Float!, $date: String!, $userId: String!) {
        addMovement(concept: $concept, amount: $amount, date: $date, userId: $userId) {
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
      concept: 'Ingreso',
      amount: 100,
      date: new Date().toISOString(),
      userId: '1',
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
    const data = result.data as unknown as AddMovementData;
    expect(data.addMovement).toBeDefined();
    expect(data.addMovement.id).toBe('mov1');
    expect(data.addMovement.concept).toBe('Ingreso');
    expect(data.addMovement.amount).toBe(100);
    expect(data.addMovement.user).toHaveProperty('id', '1');

    const { prisma } = require('@/lib/prisma');
    expect(prisma.movement.create).toHaveBeenCalledTimes(1);
    expect(prisma.movement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          concept: variables.concept,
          amount: variables.amount,
          date: expect.any(Date),
          userId: variables.userId,
        },
        include: {
          user: true,
        },
      })
    );
  });
});
