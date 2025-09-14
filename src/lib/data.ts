// @ts-nocheck
import type { User, Post } from './types';
import { db } from './firebase-admin';

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');

// Mock API functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return undefined;
  }
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    return undefined;
  }
  return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function getPostsForUser(society: string): Promise<Post[]> {
  const snapshot = await postsCollection
    .where('location.society', '==', society)
    .orderBy('deadline', 'asc')
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const postWithTimestamp = {
    ...postData,
    createdAt: new Date().toISOString(),
  };
  const docRef = await postsCollection.add(postWithTimestamp);
  return { id: docRef.id, ...postWithTimestamp };
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  await usersCollection.doc(userId).set(updates, { merge: true });
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('User not found after update');
  }
  return updatedUser;
}

export async function createUserInDb(data: { name: string; email: string; photoURL: string | null; password?: string }): Promise<User> {
  const newUser: Omit<User, 'id'> = {
    name: data.name,
    email: data.email,
    photoURL: data.photoURL,
    password: data.password || '', // In a real app, hash this
    contact: { phone: '', whatsapp: '' },
    location: { hostel: '', society: '' },
    subscription: { status: 'inactive', plan: null, expiry: null },
  };

  const docRef = await usersCollection.add(newUser);
  const createdUser = (await docRef.get()).data() as Omit<User, 'id'>;

  return { ...createdUser, id: docRef.id };
}