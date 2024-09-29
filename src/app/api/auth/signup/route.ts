import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../../prisma/client';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export async function POST(request: Request) {
  console.log('Signup API endpoint called at', new Date().toISOString());

  try {
    console.log('Parsing and validating request body');
    const { email, password, name } = signupSchema.parse(await request.json());
    console.log(`Validated data - Email: ${email}, Name: ${name}`);

    // Check if user already exists
    console.log('Checking if user already exists in the database');
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.warn(`User with email ${email} already exists`);
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    // Hash the password
    console.log('Hashing the password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create the user in the database
    console.log('Creating new user in the database');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log(`User created successfully with ID: ${user.id}`);

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Error in signup API:', error, 'at', new Date().toISOString());
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if ((error as any).code === 'P2002') {
      console.warn('Unique constraint violation: Email already in use');
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}