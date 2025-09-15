// @ts-nocheck
import type { User, Post } from './types';
import { db } from './firebase-admin';

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');

// Mock API functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
  console.log(`data: findUserByEmail called for: ${email}`);
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    console.log(`data: No user found with email: ${email}`);
    return undefined;
  }
  const userDoc = snapshot.docs[0];
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  console.log(`data: User found with ID: ${userDoc.id}`, userData);
  return userData;
}

export async function getUserById(userId: string): Promise<User | undefined> {
  console.log(`data: getUserById called for ID: ${userId}`);
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    console.log(`data: No user found with ID: ${userId}`);
    return undefined;
  }
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  console.log(`data: User found:`, userData);
  return userData;
}

export async function getPostsForUser(society: string): Promise<Post[]> {
  if (!society) return [];
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

export async function createUserInDb(data: { name: string; email: string; photoURL?: string | null; password?: string }): Promise<User> {
  console.log(`data: createUserInDb called for email: ${data.email}`);
  const newUserTemplate: Omit<User, 'id'> = {
    name: data.name,
    email: data.email,
    photoURL: data.photoURL || null,
    password: data.password || '', // In a real app, hash this
    contact: { phone: '', whatsapp: '' },
    location: { hostel: '', society: '' },
    subscription: { status: 'inactive', plan: null, expiry: null },
  };

  console.log('data: Writing new user data to Firestore:', newUserTemplate);
  const docRef = await usersCollection.add(newUserTemplate);
  console.log(`data: New user document created with ID: ${docRef.id}`);
  const newUserDoc = await docRef.get();

  const result = { id: docRef.id, ...newUserDoc.data() } as User;
  console.log('data: Returning new user object:', result);
  return result;
}