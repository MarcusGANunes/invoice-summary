import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ name: token.name });
    
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}