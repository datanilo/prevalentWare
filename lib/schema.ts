import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { prisma } from '@/lib/prisma';

export const typeDefs = gql`
  enum Role {
    USER
    ADMIN
  }
    
  type User {
    id: String!
    name: String!
    email: String!
    phone: String!
    role: Role!
  }

  type Movement {
    id: String!
    concept: String!
    amount: Float!
    date: String!
    user: User!
  }
  
  type MonthlyMovement {
    month: String!
    total: Float!
  }

  type FinancialReport {
    monthlyMovements: [MonthlyMovement!]!
    currentBalance: Float!
  }

  type Query {
    movements: [Movement!]!
    users: [User!]!
    financialReport: FinancialReport!
  }

  type Mutation {
    addMovement(concept: String!, amount: Float!, date: String!, userId: String!): Movement!
    updateUser(id: String!, name: String!, role: Role!, phone: String!): User!
    deleteMovements(ids: [String!]!): [Movement!]!
  }
`;

export const resolvers = {
  Query: {
    movements: async () => {
      return await prisma.movement.findMany({
        include: { user: true },
      });
    },
    users: async () => {
      return await prisma.user.findMany();
    },
    financialReport: async () => {
      const movements = await prisma.movement.findMany();
      const currentBalance = movements.reduce((acc, movement) => acc + movement.amount, 0);
      
      const monthlyMap: { [key: string]: number } = {};
      movements.forEach((movement) => {
        const date = new Date(movement.date);
        const month = date.toLocaleString("default", { month: "long" });
        monthlyMap[month] = (monthlyMap[month] || 0) + movement.amount;
      });
      
      const monthlyMovements = Object.keys(monthlyMap).map((month) => ({
        month,
        total: monthlyMap[month],
      }));

      return {
        monthlyMovements,
        currentBalance,
      };
    },
  },
  Mutation: {
    addMovement: async (_: unknown, args: { concept: string; amount: number; date: string; userId: string }) => {
      const { concept, amount, date, userId } = args;
      return await prisma.movement.create({
        data: {
          concept,
          amount,
          date: new Date(date),
          userId,
        },
        include: {
          user: true,
        },
      });
    },

    updateUser: async (_: unknown, args: { id: string; name: string; role: 'USER' | 'ADMIN'; phone: string }) => {
      const { id, name, role, phone } = args;
      return await prisma.user.update({
        where: { id },
        data: {
          name,
          role,
          phone,
        },
      });
    },

    deleteMovements: async (_: unknown, args: { ids: string[] }) => {
      const movementsToDelete = await prisma.movement.findMany({
        where: { id: { in: args.ids } },
        include: { user: true },
      });
      await prisma.movement.deleteMany({
        where: { id: { in: args.ids } },
      });
      return movementsToDelete;
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
