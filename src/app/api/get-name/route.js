import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const origin = req.headers.get('origin');
  const allowedOrigin = 'https://invoice-summary.vercel.app';

  try {
    if (origin !== allowedOrigin) {
      return NextResponse.json({ message: 'Origin not allowed by CORS' }, { status: 403 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const response = NextResponse.json({ name: token.name });

    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
    
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
