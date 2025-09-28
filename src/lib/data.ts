
// @ts-nocheck
import type { User, Post } from './types';
import { db } from './firebase-admin';
import { cache } from 'react';
import { Timestamp, FieldPath, type Query } from 'firebase-admin/firestore';

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const appDataCollection = db.collection('app_data');

// Helper function to convert Firestore Timestamps to JS Dates
function convertTimestamps(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      newObj[key] = convertTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}


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

async function joinAuthorToPosts(posts: any[]): Promise<Post[]> {
  if (posts.length === 0) return [];

  const authorIds = [...new Set(posts.map(p => p.authorId).filter(Boolean))];

  if (authorIds.length === 0) {
    return convertTimestamps(posts) as Post[];
  }
  
  // Use a single 'in' query to fetch all authors in one batch
  const authorSnapshots = await db.collection('users').where(FieldPath.documentId(), 'in', authorIds).get();
  
  const authors = {};
  authorSnapshots.forEach(doc => {
    authors[doc.id] = { id: doc.id, ...doc.data() };
  });

  const joinedPosts = posts.map(post => ({
    ...post,
    author: authors[post.authorId] || null,
  })).filter(p => p.author !== null);

  return convertTimestamps(joinedPosts) as Post[];
}

export async function getPostsForUser(user: User | null): Promise<Post[]> {
  let query: Query = postsCollection;

  // This query requires a composite index on `institutionName` and `createdAt`.
  if (user?.institution?.institutionName) {
    query = query.where('institutionName', '==', user.institution.institutionName).orderBy('createdAt', 'desc');
  } else {
    // Fallback for users without an institution or not logged in
    query = query.orderBy('createdAt', 'desc');
  }

  query = query.limit(25);

  const snapshot = await query.get();
  
  let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Exclude posts made by the current user from their own feed
  if (user) {
    posts = posts.filter(post => post.authorId !== user.id);
  }

  const postsWithAuthors = await joinAuthorToPosts(posts);
  
  return postsWithAuthors;
}


export async function getPostsByAuthorId(authorId: string): Promise<Post[]> {
  const snapshot = await postsCollection.where('authorId', '==', authorId).orderBy('createdAt', 'desc').get();
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const postsWithAuthors = await joinAuthorToPosts(posts);
  
  return postsWithAuthors;
}


export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'author'>): Promise<Post> {
  const postWithTimestamp = {
    ...postData,
    createdAt: new Date(),
  };
  const docRef = await postsCollection.add(postWithTimestamp);
  const newPostData = (await docRef.get()).data();
  return { id: docRef.id, ...newPostData } as Post;
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

export const getBannerImageUrl = cache(async (): Promise<string | null> => {
  try {
    const snapshot = await appDataCollection.limit(1).get();
    if (snapshot.empty) {
      console.log('data: No document found in app_data collection.');
      return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    return data.banner_img || null;
  } catch (error) {
    console.error('Error fetching banner image URL:', error);
    return null;
  }
});
