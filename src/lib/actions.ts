
'use server';

import { revalidatePath } from 'next/cache';
import { Post, User, Chat, Message } from './types';
import {FieldValue,Timestamp,} from 'firebase-admin/firestore';
import { db as adminDb, auth as adminAuth } from './firebase-admin';
import { cookies } from 'next/headers';
import { findUserByEmail, createUserInDb, getAuthorAndInstitution, getPostsByAuthorId, getPostById as fetchPostById, getUserById } from './data';

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

export async function createPostAction(prevState: any, formData: FormData): Promise<{ success: boolean; message?: string; post?: Post }> {
  const authorId = formData.get('authorId') as string;

  try {
    const authorResult = await getAuthorAndInstitution(authorId);
    if (!authorResult) {
      return { success: false, message: 'Error: Could not find author or institution.' };
    }

    const { authorData } = authorResult;

    const deadlineStr = formData.get('timestamps.deadline') as string;
    const deadline = Timestamp.fromDate(new Date(deadlineStr));

    const newPostData: Omit<Post, 'id' | 'author'> = {
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

    const docRef = await adminDb.collection('posts').add(newPostData);
    const newPost = await fetchPostById(docRef.id);
    
    revalidatePath('/');
    revalidatePath('/my-posts');
    
    if (!newPost) {
        return { success: false, message: "Post created but failed to retrieve." };
    }

    // Return the newly created post so the client can update its cache
    return { success: true, post: JSON.parse(JSON.stringify(newPost)) };

  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, message: `Error creating post: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function deletePostAction(postId: string, userId: string) {
    try {
        await adminDb.collection('posts').doc(postId).delete();
        revalidatePath('/my-posts');
        return { success: true, message: 'Post deleted successfully.' };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'Failed to delete post.' };
    }
}

export async function updatePostAction(prevState: any, formData: FormData): Promise<{ success: boolean; message?: string; post?: Post }> {
    const postId = formData.get('postId') as string;
    const userId = formData.get('userId') as string;
    if (!postId || !userId) {
        return { success: false, message: 'Error: Post ID or User ID is missing.' };
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
        const updatedPost = await fetchPostById(postId);

        revalidatePath('/');
        revalidatePath('/my-posts');
        revalidatePath(`/edit-post/${postId}`);

        if (!updatedPost) {
            return { success: false, message: "Post updated but failed to retrieve." };
        }

        return { success: true, message: 'Post updated successfully!', post: JSON.parse(JSON.stringify(updatedPost)) };
    } catch (error) {
        console.error(`Error updating post ${postId}:`, error);
        return { success: false, message: `Error updating post: ${error instanceof Error ? error.message : 'Unknown error'}` };
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

export async function startOrGetChatAction(currentUserId: string, otherUserId: string, postId?: string, postTitle?: string): Promise<{ success: boolean; chatId?: string; message?: string }> {
  if (currentUserId === otherUserId) {
    return { success: false, message: 'Cannot start a chat with yourself.' };
  }

  const participants = [currentUserId, otherUserId].sort();
  const chatId = participants.join('_');
  
  const chatRef = adminDb.collection('chats').doc(chatId);
  const chatDoc = await chatRef.get();

  try {
    if (!chatDoc.exists) {
      // Create new chat
      await chatRef.set({
        participants: participants,
        lastMessage: {
          text: `Chat started`,
          timestamp: FieldValue.serverTimestamp(),
          senderId: 'system',
        },
      });

      // If it's from a post, send the initial message
      if (postId && postTitle) {
        const firstMessage: Omit<Message, 'id' | 'timestamp'> = {
          senderId: 'system',
          text: `I want to join this order: ${postTitle}`,
          postId: postId,
          postTitle: postTitle,
        };
        await chatRef.collection('messages').add({
          ...firstMessage,
          timestamp: FieldValue.serverTimestamp(),
        });
      }
    } else {
       // If chat exists and it's initiated from a post, check if a message for this post already exists
      if (postId && postTitle) {
        const messagesRef = chatRef.collection('messages');
        const postIntroQuery = await messagesRef.where('postId', '==', postId).where('senderId', '==', 'system').limit(1).get();

        if (postIntroQuery.empty) {
          // No intro message for this post yet, so add one
          const introMessage: Omit<Message, 'id' | 'timestamp'> = {
            senderId: 'system',
            text: `I'm interested in this order: ${postTitle}`,
            postId: postId,
            postTitle: postTitle,
          };
          await messagesRef.add({
            ...introMessage,
            timestamp: FieldValue.serverTimestamp(),
          });
        }
      }
    }
    revalidatePath('/chat');
    revalidatePath(`/chat/${chatId}`);
    return { success: true, chatId };
  } catch (error) {
    console.error('Error starting or getting chat:', error);
    return { success: false, message: 'Failed to initiate chat.' };
  }
}

export async function sendMessageAction(chatId: string, senderId: string, text: string): Promise<{ success: boolean; message?: string }> {
  if (!text.trim()) {
    return { success: false, message: 'Message cannot be empty.' };
  }

  const chatRef = adminDb.collection('chats').doc(chatId);
  const messagesRef = chatRef.collection('messages');

  try {
    const messageData = {
      senderId,
      text,
      timestamp: FieldValue.serverTimestamp(),
    };
    
    // Add new message
    await messagesRef.add(messageData);

    // Update lastMessage on the chat document
    await chatRef.update({
      lastMessage: {
        text,
        senderId,
        timestamp: messageData.timestamp,
      },
    });

    revalidatePath(`/chat/${chatId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, message: 'Failed to send message.' };
  }
}

export async function getChatsForUserAction(userId: string): Promise<{ success: boolean; chats?: Chat[]; message?: string }> {
  try {
    const chatsSnapshot = await adminDb.collection('chats').where('participants', 'array-contains', userId).get();
    
    if (chatsSnapshot.empty) {
      return { success: true, chats: [] };
    }

    let chats: Chat[] = chatsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Chat));
    
    // Get all unique participant IDs from all chats
    const participantIds = new Set<string>();
    chats.forEach(chat => chat.participants.forEach(id => participantIds.add(id)));

    // Fetch user profiles for all participants
    const userProfiles: { [key: string]: Pick<User, 'id' | 'userProfile'> } = {};
    const userPromises = Array.from(participantIds).map(async (id) => {
        const user = await getUserById(id);
        if (user) {
            userProfiles[id] = { id: user.id, userProfile: user.userProfile };
        }
    });
    await Promise.all(userPromises);
    
    // Attach user data to each chat and sort
    chats = chats.map(chat => ({
      ...chat,
      users: {
        [chat.participants[0]]: userProfiles[chat.participants[0]],
        [chat.participants[1]]: userProfiles[chat.participants[1]],
      }
    })).sort((a, b) => {
      const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return { success: true, chats: JSON.parse(JSON.stringify(chats)) };
  } catch (error) {
    console.error('Error fetching chats:', error);
    return { success: false, message: 'Failed to load chats.' };
  }
}

    