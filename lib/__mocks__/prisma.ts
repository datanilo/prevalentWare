export const prisma = {
  user: {
    findMany: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Usuario Test',
        email: 'test@example.com',
        phone: '123456789',
        role: 'USER',
      },
    ]),
    update: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Usuario Actualizado',
      email: 'test@example.com',
      phone: '987654321',
      role: 'ADMIN',
    }),
  },
  movement: {
    findMany: jest.fn().mockResolvedValue([
      {
        id: 'mov1',
        concept: 'Ingreso',
        amount: 100,
        date: new Date().toISOString(),
        user: {
          id: '1',
          name: 'Usuario Test',
          email: 'test@example.com',
          phone: '123456789',
          role: 'USER',
        },
      },
    ]),
    create: jest.fn().mockResolvedValue({
      id: 'mov1',
      concept: 'Ingreso',
      amount: 100,
      date: new Date().toISOString(),
      user: {
        id: '1',
        name: 'Usuario Test',
        email: 'test@example.com',
        phone: '123456789',
        role: 'USER',
      },
    }),
    deleteMany: jest.fn().mockResolvedValue([]),
  },
};
