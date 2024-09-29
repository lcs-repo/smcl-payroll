'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Signup form submitted at', new Date().toISOString());
    
    try {
      console.log('Validating input');
      signupSchema.parse({ email, password, name });

      console.log('Sending signup request');
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await res.json();
      console.log('Signup response:', data);

      if (res.ok) {
        console.log('Signup successful!');
        router.push('/login');
      } else {
        console.error('Signup failed:', data.error);
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Sign Up</button>
      </form>
    </div>
  );
}