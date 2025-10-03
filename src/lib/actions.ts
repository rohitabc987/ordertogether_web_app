





'use server';

import { revalidatePath } from 'next/cache';
import { Post, User } from './types';
import {FieldValue,Timestamp,} from 'firebase-admin/firestore';
import { db as adminDb, auth as adminAuth } from './firebase-admin';
import { cookies } from 'next/headers';
import { findUserByEmail, createUserInDb, getAuthorAndInstitution, getPostsByAuthorId } from './data';

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

export async function createPostAction(prevState: any, formData: FormData) {
  const authorId = formData.get('authorId') as string;

  try {
    const authorResult = await getAuthorAndInstitution(authorId);
    if (!authorResult) {
      return { message: 'Error: Could not find author or institution.' };
    }

    const { authorData } = authorResult;

    const deadlineStr = formData.get('timestamps.deadline') as string;
    const deadline = Timestamp.fromDate(new Date(deadlineStr));

    const newPost: Omit<Post, 'id' | 'author'> = {
      authorId,
      authorInfo: {
        authorName: authorData.userProfile.name,
        gender: authorData.userProfile.gender || 'prefer_not_to_say',
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
        createdAt: FieldValue.serverTimestamp() as any,
        updatedAt: FieldValue.serverTimestamp() as any,
        deadline: deadline as any,
      },
      location: {
        institutionName: authorData.institution?.institutionName ?? undefined,
        area: authorData.location?.area ?? undefined,
        city: authorData.location?.city ?? undefined,
      },
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
        
        const userData = userDoc.data() as User;
        const lastUpdateStr = userData.userProfile?.lastProfileUpdate;
        
        if (lastUpdateStr) {
            const lastUpdate = new Date(lastUpdateStr);
            if ((new Date().getTime() - lastUpdate.getTime()) < oneWeek) {
                 return { message: 'Profile can only be updated once a week.' };
            }
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
        revalidatePath('/');

        return { message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { message: `Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}


export async function deactivateSinglePostPassAction(userId: string) {
  try {
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return { success: false, message: 'User not found.' };
    }

    const user = userDoc.data() as User;

    if (user.subscription?.plan === 'single-post' && user.subscription?.status === 'active') {
      await userRef.update({
        'subscription.status': 'inactive',
        'subscription.postsViewed': 1, 
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
        photoURL: decodedToken.picture || null,
      };
      user = await createUserInDb(newUser);
    }
    
    const cookieStore = await cookies();
    cookieStore.set('session_userId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Authentication failed.' };
  }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('session_userId');
}


export async function subscribeAction(planId: 'single-post' | 'daily' | 'weekly' | 'monthly', userId: string) {
  if (!userId) {
    return { success: false, message: 'User not found.' };
  }

  try {
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
        expiry.setFullYear(now.getFullYear() + 1);
        break;
    }
    
    const subscriptionData = {
      status: 'active' as const,
      plan: planId,
      startDate: Timestamp.fromDate(now),
      expiry: Timestamp.fromDate(expiry),
      postsViewed: 0,
    };
    
    await userRef.update({
        'subscription': subscriptionData
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
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const currentCount = userDoc.data()?.subscription?.postsViewed || 0;
            await userRef.update({
                'subscription.postsViewed': currentCount + count
            });
        }
    } catch (error) {
        console.error(`Failed to update view count for user ${userId}:`, error);
    }
}

export async function getMyPostsAction(userId: string) {
  if (!userId) {
    return { success: false, message: 'User not found.', posts: [] };
  }
  try {
    const posts = await getPostsByAuthorId(userId);
    // Ensure data is serializable before sending to the client
    return { success: true, posts: JSON.parse(JSON.stringify(posts)) };
  } catch (error) {
    console.error('Error fetching my posts:', error);
    return { success: false, message: 'Failed to fetch posts.', posts: [] };
  }
}
