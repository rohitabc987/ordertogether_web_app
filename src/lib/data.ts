// @ts-nocheck
import type { User, Post } from './types';
import { db } from './firebase-admin';
import { cache } from 'react';

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');

export async function findUserByEmail(email: string): Promise<User | undefined> {
  console.log(`data: findUserByEmail called for: ${email}`);
  const snapshot = await usersCollection.where('contact.email', '==', email).limit(1).get();
  if (snapshot.empty) {
    console.log(`data: No user found with email: ${email}`);
    return undefined;
  }
  const userDoc = snapshot.docs[0];
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  console.log(`data: User found with ID: ${userDoc.id}`, userData);
  return userData;
}

export const getUserById = cache(async (userId: string): Promise<User | undefined> => {
  console.log(`data: getUserById called for ID: ${userId}`);
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    console.log(`data: No user found with ID: ${userId}`);
    return undefined;
  }
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  console.log(`data: User found:`, userData);
  return userData;
});

export async function getPostsForUser(user: User | null): Promise<Post[]> {
  let snapshot;
  let locationQueryAttempted = false;

  if (user) {
    // Authenticated user: Try to fetch posts based on their location
    if (user.institution?.institutionName) {
      snapshot = await postsCollection.where('institution.institutionName', '==', user.institution.institutionName).orderBy('deadline', 'asc').get();
      locationQueryAttempted = true;
    } else if (user.location?.area) {
      snapshot = await postsCollection.where('location.area', '==', user.location.area).orderBy('deadline', 'asc').get();
      locationQueryAttempted = true;
    } else if (user.location?.city) {
      snapshot = await postsCollection.where('location.city', '==', user.location.city).orderBy('deadline', 'asc').get();
      locationQueryAttempted = true;
    }
  }

  // Fallback for guests or users without a location set
  if (!locationQueryAttempted) {
    snapshot = await postsCollection.orderBy('createdAt', 'desc').limit(50).get();
  }

  if (snapshot) {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  }

  return [];
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const postWithTimestamp = {
    ...postData,
    createdAt: new Date().toISOString(),
  };
  const docRef = await postsCollection.add(postWithTimestamp);
  return { id: docRef.id, ...postWithTimestamp };
}

export async function updateUser(userId: string, updates: Record<string, any>): Promise<User> {
  await usersCollection.doc(userId).update(updates);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('User not found after update');
  }
  return updatedUser;
}

export async function createUserInDb(data: { name: string; email: string; gender: string; photoURL?: string | null; }): Promise<User> {
  console.log(`data: createUserInDb called for email: ${data.email}`);
  const newUserTemplate: Omit<User, 'id'> = {
    userProfile: {
      name: data.name,
      gender: data.gender,
      photoURL: data.photoURL || null,
    },
    contact: {
      email: data.email,
      phone: null,
      whatsapp: null,
    },
    location: {
      area: null,
      city: null,
      pinCode: null,
    },
    institution: {
      institutionType: null,
      institutionName: null,
    },
    subscription: {
      status: 'inactive',
      plan: null,
      startDate: null,
      expiry: null,
    },
  };

  console.log('data: Writing new user data to Firestore:', newUserTemplate);
  const docRef = await usersCollection.add(newUserTemplate);
  console.log(`data: New user document created with ID: ${docRef.id}`);
  const newUserDoc = await docRef.get();

  const result = { id: docRef.id, ...newUserDoc.data() } as User;
  console.log('data: Returning new user object:', result);
  return result;
}
