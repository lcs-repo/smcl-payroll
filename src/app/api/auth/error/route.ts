import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  console.error('NextAuth Error:', error);
  return NextResponse.json({ error });
}