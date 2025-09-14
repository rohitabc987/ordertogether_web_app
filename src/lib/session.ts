'use server';

import { cookies } from 'next/headers';
import { getUserById } from './data';
import type { User } from './types';

export async function getUserId(): Promise<string | undefined> {
  const sessionCookie = cookies().get('session_userId');
  return sessionCookie?.value;
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }
  const user = await getUserById(userId);
  return user || null;
}
