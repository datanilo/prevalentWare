import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { typeDefs, resolvers } from '@/app/api/graphql/route';

jest.mock('@/lib/prisma');

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

interface UpdateUserData {
  updateUser: User;
}

const schema = makeExecutableSchema({ typeDefs, resolvers });
let server: ApolloServer;

beforeAll(() => {
  server = new ApolloServer({ schema });
});

describe('Pruebas de la mutación updateUser', () => {
  it('debe actualizar el name, role y phone de un usuario sin modificar el id', async () => {
    const mutation = `
      mutation UpdateUser($id: String!, $name: String!, $role: Role!, $phone: String!) {
        updateUser(id: $id, name: $name, role: $role, phone: $phone) {
          id
          name
          email
          phone
          role
        }
      }
    `;

    const variables = {
      id: '1',
      name: 'Usuario Actualizado',
      role: 'ADMIN',
      phone: '987654321',
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

    const data = result.data as unknown as UpdateUserData;
    expect(data.updateUser).toBeDefined();
    expect(data.updateUser.id).toBe(variables.id);
    expect(data.updateUser.name).toBe(variables.name);
    expect(data.updateUser.phone).toBe(variables.phone);
    expect(data.updateUser.role).toBe(variables.role);

    const { prisma } = require('@/lib/prisma');
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: variables.id },
        data: {
          name: variables.name,
          role: variables.role,
          phone: variables.phone,
        },
      })
    );
  });
});
