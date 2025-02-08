// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { auth } from '@/lib/auth'; // Importa tu middleware de autenticación
import { NextResponse } from 'next/server';
import {schema} from '@/lib/schema';


// Inicializa el ApolloServer con el esquema
const server = new ApolloServer({ schema });

// Crea el handler de Next.js para Apollo Server
const nextHandler = startServerAndCreateNextHandler(server);


export const GET = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return nextHandler(req);
});

/**
 * Exporta el handler para el método POST.
 * Se protege el endpoint de la misma forma que el GET.
 */
export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  return nextHandler(req);
});