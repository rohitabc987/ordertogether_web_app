
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/data';

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get('session_userId')?.value;

  if (!userId) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ user: null });
    }
    // Ensure data is serializable
    const serializableUser = JSON.parse(JSON.stringify(user));
    return NextResponse.json({ user: serializableUser });
  } catch (error) {
    console.error('API session route error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
