import { getServerSession } from "next-auth/next";
import { authOptions } from "../authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  console.log('Session route called at', new Date().toISOString());
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET route:', session);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}