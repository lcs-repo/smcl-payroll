// app/api/employees/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/client'; // Updated import

// GET function
export async function GET() {
  const employees = await prisma.employee.findMany();
  return NextResponse.json({ employees });
}

// POST function
export async function POST(request: Request) {
  const data = await request.json();
  const newEmployee = await prisma.employee.create({ data });
  return NextResponse.json({ newEmployee });
}
