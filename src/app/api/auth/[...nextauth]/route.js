import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

const CustomPrismaAdapter = PrismaAdapter(prisma);

async function deleteSession(sessionToken) {
  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return;
    }

    await prisma.session.delete({
      where: { sessionToken },
    });

  } catch (error) {
    console.error('Logout error:', error);
  }
}

CustomPrismaAdapter.deleteSession = deleteSession;

const authOptions = {
  adapter: CustomPrismaAdapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Password is incorrect');
        }

        return user;
      },
    }),
  ],
  session: {
    jwt: true,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  async session({ session, user, token }) {
    return session
  },
};

export async function GET(req, res) {
  return await NextAuth(req, res, authOptions);
}

export async function POST(req, res) {
  return await NextAuth(req, res, authOptions);
}