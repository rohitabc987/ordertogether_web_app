
// @ts-nocheck
import type { User, Post } from './types';
import { db } from './firebase-admin';
import { cache } from 'react';
import { Timestamp, FieldPath } from 'firebase-admin/firestore';

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


export async function getPostsForUser(user: User | null): Promise<Post[]> {
  // Simplified query: fetch the 50 most recent posts.
  const query = postsCollection.orderBy('createdAt', 'desc').limit(50);
  const snapshot = await query.get();
  
  let allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Exclude posts made by the current user
  if (user) {
    allPosts = allPosts.filter(post => post.authorId !== user.id);
  }

  // If a user is logged in, sort to prioritize posts from their location
  if (user) {
    allPosts.sort((a, b) => {
      const aIsLocal = (a.institution?.institutionName && a.institution.institutionName === user.institution?.institutionName) ||
                       (a.location?.area && a.location.area === user.location?.area) ||
                       (a.location?.city && a.location.city === user.location?.city);
      const bIsLocal = (b.institution?.institutionName && b.institution.institutionName === user.institution?.institutionName) ||
                       (b.location?.area && b.location.area === user.location?.area) ||
                       (b.location?.city && b.location.city === user.location?.city);

      if (aIsLocal && !bIsLocal) return -1; // a comes first
      if (!aIsLocal && bIsLocal) return 1;  // b comes first
      return 0; // maintain original order (by date)
    });
  }

  return convertTimestamps(allPosts) as Post[];
}


export async function getPostsByAuthorId(authorId: string): Promise<Post[]> {
  const snapshot = await postsCollection.where('authorId', '==', authorId).orderBy('createdAt', 'desc').get();
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return convertTimestamps(posts) as Post[];
}


export async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const postWithTimestamp = {
    ...postData,
    createdAt: new Date(),
  };
  const docRef = await postsCollection.add(postWithTimestamp);
  const newPostData = (await docRef.get()).data();
  return convertTimestamps({ id: docRef.id, ...newPostData }) as Post;
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
