
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
    // When serializing for the client, toISOString() is a good, standard format.
    return obj.toDate().toISOString();
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

export const getAuthorAndInstitution = cache(async (authorId: string): Promise<{ authorData: User; institutionId: string; } | null> => {
  try {
    const userDoc = await usersCollection.doc(authorId).get();
    if (!userDoc.exists) return null;

    const authorData = { id: userDoc.id, ...userDoc.data() } as User;
    const institutionId = authorData.institution?.institutionName;

    if (!institutionId) {
      console.warn(`User ${authorId} does not have an institutionId.`);
      return null;
    }
    return { authorData: convertTimestamps(authorData), institutionId };
  } catch (error) {
    console.error('Error fetching user and institution:', error);
    return null;
  }
});


export const findUserByEmail = cache(async (email: string): Promise<User | undefined> => {
  console.log(`data: findUserByEmail called for: ${email}`);
  const snapshot = await usersCollection.where('contact.email', '==', email).limit(1).get();
  if (snapshot.empty) {
    console.log(`data: No user found with email: ${email}`);
    return undefined;
  }
  const userDoc = snapshot.docs[0];
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  console.log(`data: User found with ID: ${userDoc.id}`, userData);
  return convertTimestamps(userData);
});

export const getUserById = cache(async (userId: string): Promise<User | undefined> => {
  console.log(`data: getUserById called for ID: ${userId}`);
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    console.log(`data: No user found with ID: ${userId}`);
    return undefined;
  }
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  // Convert timestamps for client-side usage
  return convertTimestamps(userData);
});

async function joinAuthorToPosts(posts: any[]): Promise<Post[]> {
  if (posts.length === 0) return [];

  const authorIds = [...new Set(posts.map(p => p.authorId).filter(Boolean))];
  
  const authors = {};
  if (authorIds.length > 0) {
    const authorPromises = authorIds.map(id => getUserById(id));
    const authorResults = await Promise.all(authorPromises);
    authorResults.forEach(author => {
      if (author) {
        authors[author.id] = author;
      }
    });
  }

  const joinedPosts = posts.map(post => ({
    ...post,
    author: authors[post.authorId] || null,
  })).filter(p => p.author !== null);

  // This is the critical fix: convert timestamps AFTER joining the author.
  return convertTimestamps(joinedPosts);
}

export const getPostsForUser = cache(async (user: User | null): Promise<Post[]> => {
  let query: Query = postsCollection;

  if (user?.institution?.institutionName) {
    query = query.where('location.institutionName', '==', user.institution.institutionName);
  } else {
    // Only apply ordering when not filtering by institution to avoid composite index need
    query = query.orderBy('timestamps.createdAt', 'desc');
  }

  query = query.limit(25);

  const snapshot = await query.get();
  
  let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Manually sort if we didn't do it in the query
  if (user?.institution?.institutionName) {
    posts.sort((a, b) => b.timestamps.createdAt.toMillis() - a.timestamps.createdAt.toMillis());
  }

  // Exclude posts made by the current user from their own feed
  if (user) {
    posts = posts.filter(post => post.authorId !== user.id);
  }

  const postsWithAuthors = await joinAuthorToPosts(posts);
  
  return postsWithAuthors;
});


export const getPostsByAuthorId = cache(async (authorId: string): Promise<Post[]> => {
  const snapshot = await postsCollection.where('authorId', '==', authorId).get();
  let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Manual sort to avoid composite index
  posts.sort((a, b) => b.timestamps.createdAt.toMillis() - a.timestamps.createdAt.toMillis());
  
  const postsWithAuthors = await joinAuthorToPosts(posts);
  
  return postsWithAuthors;
});

export async function updatePost(postId: string, updates: Partial<Post>): Promise<void> {
  await postsCollection.doc(postId).update({
    ...updates,
    'timestamps.updatedAt': new Date(),
  });
}

export async function deletePost(postId: string): Promise<void> {
  await postsCollection.doc(postId).delete();
}

export const getPostById = cache(async (postId: string): Promise<Post | null> => {
  const postDoc = await postsCollection.doc(postId).get();
  if (!postDoc.exists) {
    return null;
  }
  const postData = { id: postDoc.id, ...postDoc.data() };
  const postsWithAuthor = await joinAuthorToPosts([postData]);
  return postsWithAuthor[0] || null; // Return null if author join fails
});

export async function updateUser(userId: string, updates: Record<string, any>): Promise<User> {
  await usersCollection.doc(userId).update(updates);
  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('User not found after update');
  }
  return updatedUser;
}

export async function createUserInDb(data: { name: string; email: string; photoURL?: string | null; }): Promise<User> {
  console.log(`data: createUserInDb called for email: ${data.email}`);
  const newUserTemplate: Omit<User, 'id'> = {
    userProfile: {
      name: data.name,
      gender: 'prefer_not_to_say',
      photoURL: data.photoURL || null,
    },
    contact: {
      email: data.email,
      phone: null,
      shareContact: true,
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
      postsViewed: 0,
    },
  };

  console.log('data: Writing new user data to Firestore:', newUserTemplate);
  const docRef = await usersCollection.add(newUserTemplate);
  console.log(`data: New user document created with ID: ${docRef.id}`);
  const newUserDoc = await docRef.get();

  const result = { id: docRef.id, ...newUserDoc.data() } as User;
  console.log('data: Returning new user object:', result);
  return convertTimestamps(result);
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
