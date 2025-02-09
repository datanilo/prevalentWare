import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import {schema} from '@/lib/schema';


const server = new ApolloServer({ schema });
const nextHandler = startServerAndCreateNextHandler(server);

export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return nextHandler(req);
});

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return nextHandler(req);
});
