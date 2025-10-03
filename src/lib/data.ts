
// @ts-nocheck
import type { User, Post, Chat, Message } from './types';
import { db } from './firebase-admin';
import { cache } from 'react';
import { Timestamp, FieldPath, type Query } from 'firebase-admin/firestore';

const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const appDataCollection = db.collection('app_data');
const chatsCollection = db.collection('chats');


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

// Uncached base function
const _getUserById = async (userId: string): Promise<User | undefined> => {
  console.log(`data: getUserById called for ID: ${userId}`);
  const userDoc = await usersCollection.doc(userId).get();
  if (!userDoc.exists) {
    console.log(`data: No user found with ID: ${userId}`);
    return undefined;
  }
  const userData = { id: userDoc.id, ...userDoc.data() } as User;
  // Convert timestamps for client-side usage
  return convertTimestamps(userData);
};

// Cached/memoized version of the function for server-side rendering
export const getUserById = cache(_getUserById);


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

async function joinAuthorToPosts(posts: any[]): Promise<Post[]> {
  if (posts.length === 0) return [];

  const authorIds = [...new Set(posts.map(p => p.authorId).filter(Boolean))];
  
  if (authorIds.length === 0) {
    return convertTimestamps(posts);
  }

  const authorPromises = authorIds.map(id => getUserById(id));
  const authorResults = await Promise.all(authorPromises);
  
  const authors = authorResults.reduce((acc, author) => {
    if (author) {
      acc[author.id] = author;
    }
    return acc;
  }, {});

  const joinedPosts = posts.map(post => ({
    ...post,
    author: authors[post.authorId] || null,
  })).filter(p => p.author !== null);

  // This is the critical fix: convert timestamps AFTER joining the author.
  return convertTimestamps(joinedPosts);
}

export const getPostsForUser = cache(async (user: User | null): Promise<Post[]> => {
  // Simple query that does not require a composite index
  let query: Query = postsCollection.orderBy('timestamps.createdAt', 'desc').limit(50);
  const snapshot = await query.get();
  
  let allRecentPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  let postsToDisplay = allRecentPosts;

  // If the user is logged in, filter the posts in code
  if (user) {
    // Filter posts from the user's institution
    if (user.institution?.institutionName) {
      postsToDisplay = allRecentPosts.filter(post => 
        post.location?.institutionName === user.institution.institutionName
      );
    }
    // Exclude posts made by the current user from their own feed
    postsToDisplay = postsToDisplay.filter(post => post.authorId !== user.id);
  }

  const postsWithAuthors = await joinAuthorToPosts(postsToDisplay);
  
  return postsWithAuthors;
});


export const getPostsByAuthorId = cache(async (authorId: string): Promise<Post[]> => {
  const snapshot = await postsCollection.where('authorId', '==', authorId).orderBy('timestamps.createdAt', 'desc').get();
  let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
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

const _getPostById = async (postId: string): Promise<Post | null> => {
  const postDoc = await postsCollection.doc(postId).get();
  if (!postDoc.exists) {
    return null;
  }
  const postData = { id: postDoc.id, ...postDoc.data() };
  const postsWithAuthor = await joinAuthorToPosts([postData]);
  return postsWithAuthor[0] || null; // Return null if author join fails
};
export const getPostById = cache(_getPostById);


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
      whatsapp: null,
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


export const getChatById = cache(async (chatId: string, currentUserId: string): Promise<Chat | null> => {
  const doc = await chatsCollection.doc(chatId).get();
  if (!doc.exists) {
    return null;
  }

  const chat = { id: doc.id, ...doc.data() } as Chat;

  // Security check
  if (!chat.participants.includes(currentUserId)) {
    console.warn(`Security warning: User ${currentUserId} attempted to access chat ${chatId} without being a participant.`);
    return null;
  }

  const participantPromises = chat.participants.map(id => getUserById(id));
  const participantsData = await Promise.all(participantPromises);
  
  chat.users = {};
  participantsData.forEach(user => {
    if (user) {
      chat.users[user.id] = { id: user.id, userProfile: user.userProfile };
    }
  });

  return convertTimestamps(chat);
});

export const getMessagesForChat = cache(async (chatId: string): Promise<Message[]> => {
  const messagesSnapshot = await chatsCollection.doc(chatId).collection('messages').orderBy('timestamp', 'asc').get();
  const messages = messagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Message[];
  return convertTimestamps(messages);
});
