import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0({
    clientId: process.env.AUTH_AUTH0_ID,
    clientSecret: process.env.AUTH_AUTH0_SECRET,
    issuer: process.env.AUTH_AUTH0_ISSUER,
    })
  ],
  session: {
    strategy: "database"
  },
  callbacks: {
    
    async session({ session, user }) {
      session.user.role = user.role
      return session
    },
  }, 
  
})


