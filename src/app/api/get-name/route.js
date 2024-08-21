import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
    }

    const response = new NextResponse(JSON.stringify({ name: token.name }));

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Accept');

    return response;

  } catch (error) {
    console.error('Error fetching token:', error);
    return new NextResponse(JSON.stringify({ message: 'An error occurred' }), { status: 500 });
  }
}

export async function OPTIONS(req) {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
