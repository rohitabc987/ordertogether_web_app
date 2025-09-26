import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get('session_userId')?.value;

  return NextResponse.json({ userId });
}
