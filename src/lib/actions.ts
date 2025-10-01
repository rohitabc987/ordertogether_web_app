



'use server';

import { revalidatePath } from 'next/cache';
import { Post, User, Subscription } from './types';
import {FieldValue,Timestamp,} from 'firebase-admin/firestore';
import { db as adminDb } from './firebase-admin';

function convertFirestoreTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) {
    return null;
  }
  if (typeof timestamp.seconds === 'number' && typeof timestamp.nanoseconds === 'number') {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  const date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date;
  }
  return null;
}

async function getAuthorAndInstitution(authorId: string): Promise<{ authorData: User; institutionId: string; } | null> {
  try {
    const userDoc = await adminDb.collection('users').doc(authorId).get();
    if (!userDoc.exists) return null;

    const authorData = userDoc.data() as User;
    const institutionId = authorData.institution?.institutionName;

    if (!institutionId) {
      console.warn(`User ${authorId} does not have an institutionId.`);
      return null;
    }
    return { authorData, institutionId };
  } catch (error) {
    console.error('Error fetching user and institution:', error);
    return null;
  }
}

export async function createPostAction(prevState: any, formData: FormData) {
  const authorId = formData.get('authorId') as string;

  try {
    const authorResult = await getAuthorAndInstitution(authorId);
    if (!authorResult) {
      return { message: 'Error: Could not find author or institution.' };
    }

    const { authorData, institutionId } = authorResult;

    const deadlineStr = formData.get('timestamps.deadline') as string;
    const deadline = Timestamp.fromDate(new Date(deadlineStr));

    const newPost: Omit<Post, 'id' | 'author'> = {
      authorId,
      authorInfo: {
        authorName: authorData.userProfile.name,
        gender: authorData.userProfile.gender,
      },
      details: {
        title: formData.get('details.title') as string,
        restaurant: formData.get('details.restaurant') as string,
        notes: formData.get('details.notes') as string,
      },
      order: {
        totalAmount: parseFloat(formData.get('order.totalAmount') as string),
        contributionAmount: parseFloat(formData.get('order.contributionAmount') as string),
      },
      timestamps: {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        deadline: deadline,
      },
      location: {
        institutionName: authorData.institution?.institutionName,
        area: authorData.location?.area,
        city: authorData.location?.city,
      },
      status: 'active',
    };

    await adminDb.collection('posts').add(newPost);
    
    revalidatePath('/');
    revalidatePath('/my-posts');

    return { message: 'Post created successfully!' };

  } catch (error) {
    console.error('Error creating post:', error);
    return { message: `Error creating post: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function deletePostAction(postId: string) {
    try {
        await adminDb.collection('posts').doc(postId).delete();
        revalidatePath('/my-posts');
        return { success: true, message: 'Post deleted successfully.' };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'Failed to delete post.' };
    }
}

export async function updatePostAction(prevState: any, formData: FormData) {
    const postId = formData.get('postId') as string;
    if (!postId) {
        return { message: 'Error: Post ID is missing.' };
    }

    try {
        const deadlineStr = formData.get('timestamps.deadline') as string;
        const deadline = Timestamp.fromDate(new Date(deadlineStr));

        const updates = {
            'details.title': formData.get('details.title') as string,
            'details.restaurant': formData.get('details.restaurant') as string,
            'details.notes': formData.get('details.notes') as string,
            'order.totalAmount': parseFloat(formData.get('order.totalAmount') as string),
            'order.contributionAmount': parseFloat(formData.get('order.contributionAmount') as string),
            'timestamps.deadline': deadline,
            'timestamps.updatedAt': FieldValue.serverTimestamp(),
        };

        await adminDb.collection('posts').doc(postId).update(updates);

        revalidatePath('/');
        revalidatePath('/my-posts');
        revalidatePath(`/edit-post/${postId}`);

        return { message: 'Post updated successfully!' };
    } catch (error) {
        console.error(`Error updating post ${postId}:`, error);
        return { message: `Error updating post: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}


export async function updateProfileAction(prevState: any, formData: FormData) {
    const userId = formData.get('id') as string;
    if (!userId) {
        return { message: 'Error: User ID is missing.' };
    }

    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    try {
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return { message: 'Error: User not found.' };
        }

        const lastUpdate = userDoc.data()?.userProfile?.lastProfileUpdate;
        if (lastUpdate && (new Date().getTime() - lastUpdate.toDate().getTime()) < oneWeek) {
            return { message: 'Profile can only be updated once a week.' };
        }
        
        const updates: Record<string, any> = {
            'userProfile.name': formData.get('name'),
            'userProfile.lastProfileUpdate': FieldValue.serverTimestamp(),
            'contact.phone': formData.get('contactNumber'),
            'contact.shareContact': formData.get('shareContact') === 'on',
            'institution.institutionType': formData.get('institutionType'),
            'institution.institutionName': formData.get('institutionName'),
            'location.area': formData.get('area'),
            'location.city': formData.get('city'),
            'location.pinCode': formData.get('pinCode'),
        };

        await userRef.update(updates);
        
        revalidatePath('/profile');

        return { message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { message: `Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}



export async function getPostsForUser(userId: string): Promise<Post[]> {
  try {
    const now = Timestamp.now();
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('authorId', '==', userId)
      .orderBy('timestamps.createdAt', 'desc')
      .get();

    if (postsSnapshot.empty) {
      return [];
    }

    const posts: Post[] = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      const deadline = convertFirestoreTimestampToDate(data.timestamps.deadline);

      return {
        id: doc.id,
        ...
        data,
        timestamps: { ...data.timestamps, deadline }, 
      } as Post;
    });
    
    return posts;

  } catch (error) {
    console.error("Error fetching user's posts:", error);
    return [];
  }
}



export async function getActivePosts(institutionId: string): Promise<Post[]> {
  try {
    const now = Timestamp.now();
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('location.institutionId', '==', institutionId)
      .orderBy('timestamps.deadline', 'desc') 
      .get();

    if (postsSnapshot.empty) {
      return [];
    }

    const authorIds = [...new Set(postsSnapshot.docs.map(doc => doc.data().authorId))];
    const authorSnapshots = await adminDb.collection('users').where(FieldValue.documentId(), 'in', authorIds).get();
    const authors = new Map(authorSnapshots.docs.map(doc => [doc.id, doc.data() as User]));

    const posts: Post[] = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      const author = authors.get(data.authorId);
      
      if (!author) {
        return null;
      }

      return {
        id: doc.id,
        ...data,
        author: author, 
      } as Post;
    }).filter((post): post is Post => post !== null);

    return posts;

  } catch (error) {
    console.error("Error fetching institution's posts:", error);
    return [];
  }
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subDoc = await adminDb.collection('subscriptions').doc(userId).get();
    if (!subDoc.exists) {
      return null;
    }
    return subDoc.data() as Subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

export async function deactivateSinglePostPassAction(userId: string) {
  try {
    const subscriptionRef = adminDb.collection('subscriptions').doc(userId);
    const subDoc = await subscriptionRef.get();

    if (!subDoc.exists) {
      return { success: false, message: 'Subscription not found.' };
    }

    const subscription = subDoc.data() as Subscription;

    if (subscription.plan === 'single-post' && subscription.status === 'active') {
      await subscriptionRef.update({
        status: 'inactive',
        'usage.postsViewed': 1, 
      });

      revalidatePath('/'); 

      return { success: true, message: 'Single-post pass used and deactivated.' };
    } else {
      return { success: false, message: 'No active single-post pass to deactivate.' };
    }
  } catch (error) {
    console.error('Error deactivating single-post pass:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}


import { cookies } from 'next/headers';
import { auth as adminAuth } from './firebase-admin';

export async function verifyAndSignInAction(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    if (!email) {
      return { success: false, message: 'Email not found in token.' };
    }

    let user = await findUserByEmail(email);

    if (!user) {
      const newUser = {
        name: decodedToken.name || 'New User',
        email: email,
        gender: 'prefer_not_to_say',
        photoURL: decodedToken.picture || null,
      };
      user = await createUserInDb(newUser);
    }
    
    // Set cookies for session management
    const cookieStore = cookies();
    cookieStore.set('session_userId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Authentication failed.' };
  }
}

async function findUserByEmail(email: string): Promise<User | undefined> {
  const snapshot = await adminDb.collection('users').where('contact.email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return undefined;
  }
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() } as User;
}

async function createUserInDb(data: { name: string; email: string; gender: string; photoURL?: string | null; }): Promise<User> {
  const newUserTemplate: Omit<User, 'id'> = {
    userProfile: {
      name: data.name,
      gender: data.gender as any,
      photoURL: data.photoURL,
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
    },
  };

  const docRef = await adminDb.collection('users').add(newUserTemplate);
  const newUserDoc = await docRef.get();
  return { id: docRef.id, ...newUserDoc.data() } as User;
}

export async function logoutAction() {
    const cookieStore = cookies();
    cookieStore.delete('session_userId');
}


export async function subscribeAction(planId: 'single-post' | 'daily' | 'weekly' | 'monthly', userId: string) {
  if (!userId) {
    return { success: false, message: 'User not found.' };
  }

  try {
    const subscriptionRef = adminDb.collection('subscriptions').doc(userId);
    const userRef = adminDb.collection('users').doc(userId);

    const now = new Date();
    let expiry = new Date(now);

    switch (planId) {
      case 'daily':
        expiry.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        expiry.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        expiry.setMonth(now.getMonth() + 1);
        break;
      case 'single-post':
        // Expiry doesn't matter as much, it's usage-based
        expiry.setFullYear(now.getFullYear() + 1);
        break;
    }
    
    const subscriptionData: Subscription = {
      status: 'active',
      plan: planId,
      startDate: Timestamp.fromDate(now),
      expiry: Timestamp.fromDate(expiry),
      usage: {
        postsViewed: 0,
      }
    };
    
    await userRef.update({
        'subscription.status': 'active',
        'subscription.plan': planId,
        'subscription.startDate': Timestamp.fromDate(now),
        'subscription.expiry': Timestamp.fromDate(expiry),
    });

    revalidatePath('/pricing');
    revalidatePath('/profile');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error('Subscription Error:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function submitFeedbackAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const feedback = formData.get('feedback') as string;

    if (!feedback) {
        return { success: false, message: 'Feedback cannot be empty.' };
    }

    try {
        await adminDb.collection('feedback').add({
            email: email || 'anonymous',
            feedback: feedback,
            submittedAt: FieldValue.serverTimestamp(),
        });
        return { success: true, message: 'Your feedback has been submitted.' };
    } catch (error) {
        console.error('Feedback submission error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}

export async function updatePostViewCountAction(userId: string, count: number) {
    if (!userId || count === 0) return;

    const userRef = adminDb.collection('users').doc(userId);

    try {
        await userRef.update({
            'activity.postsViewed': FieldValue.increment(count)
        });
    } catch (error) {
        console.error(`Failed to update view count for user ${userId}:`, error);
    }
}