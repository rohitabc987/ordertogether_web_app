
// @ts-nocheck
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { createPost, findUserByEmail, updateUser, createUserInDb, getUserById } from '@/lib/data';
import { auth as adminAuth } from 'firebase-admin';
import { db } from './firebase-admin';

export async function verifyAndSignInAction(idToken: string) {
  console.log('actions: verifyAndSignInAction started.');
  try {
    if (!idToken) {
      return { success: false, message: 'No token provided.' };
    }
    const decodedToken = await adminAuth().verifyIdToken(idToken);
    console.log('actions: ID token verified successfully. Decoded token:', decodedToken);

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name;
    const photoURL = decodedToken.picture;
    const gender = decodedToken.gender || 'prefer_not_to_say';

    if (!email || !name) {
      console.error('actions: Google account missing email or name.');
      return { success: false, message: 'Google account must have an email and name.' };
    }

    if (!email.endsWith('@iitdh.ac.in')) {
      console.error(`actions: Email is not from @iitdh.ac.in domain: ${email}`);
      return { success: false, message: `Only users with a @iitdh.ac.in email can sign up. Your email is ${email}.` };
    }

    console.log(`actions: Attempting to find user with email: ${email}`);
    let user = await findUserByEmail(email);
    let userId: string;

    if (!user) {
      console.log('actions: User not found. Creating new user in DB...');
      const newUser = await createUserInDb({
        name: name,
        email: email,
        photoURL: photoURL,
        gender: gender
      });
      userId = newUser.id;
      console.log('actions: New user created with ID:', userId);
    } else {
      userId = user.id;
      console.log('actions: Existing user found with ID:', userId);
    }

    const cookieStore = cookies();
    cookieStore.set('session_userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    cookieStore.set('session_authId', uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    revalidatePath('/');
    console.log('actions: Session cookie set successfully.');

    return { success: true };
  } catch (error: any) {
    console.error('actions: Error during token verification:', error);
    return { success: false, message: `Internal error: ${error.message}` };
  }
}


export async function logoutAction() {
  const cookieStore = cookies();
  const authId = cookieStore.get('session_authId')?.value;
  if (authId) {
    try {
      await adminAuth().revokeRefreshTokens(authId);
    } catch (error) {
      console.error('Error revoking refresh tokens:', error);
    }
  }
  cookieStore.delete('session_userId');
  cookieStore.delete('session_authId');
  revalidatePath('/');
}

const postSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  restaurant: z.string().min(1, 'Restaurant is required.'),
  totalAmount: z.coerce.number().min(0, 'Total amount must be positive.'),
  contributionAmount: z.coerce.number().min(0, 'Contribution must be positive.'),
  deadline: z.coerce.date(),
  notes: z.string().optional(),
  authorId: z.string(),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const authorId = formData.get('authorId') as string;
  const user = await getUserById(authorId);

  if (!user || !user.userProfile.name || !user.contact.phone || !user.userProfile.gender || user.userProfile.gender === 'prefer_not_to_say') {
    return { message: 'Please complete your profile (name, contact number, and gender) before posting.' };
  }
  
  const data = Object.fromEntries(formData);

  const parsed = postSchema.safeParse(data);

  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { message: firstError || 'Invalid post data. Please check your inputs.' };
  }
  
  if (parsed.data.contributionAmount > parsed.data.totalAmount) {
    return { message: 'Your contribution cannot be greater than the total order amount.' };
  }

  // Denormalize user data into the post
  const postDataWithDenormalization = {
    ...parsed.data,
    institutionName: user.institution?.institutionName || null,
    area: user.location?.area || null,
    city: user.location?.city || null,
  };

  await createPost(postDataWithDenormalization);
  revalidatePath('/');
  redirect('/');
}

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits.'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  institutionType: z.enum(['College/University', 'Hostel/PG/Apartment']).optional(),
  institutionName: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
}).refine(data => data.gender !== 'prefer_not_to_say', {
  message: "Please select a gender.",
  path: ["gender"],
});

export async function updateProfileAction(prevState: any, formData: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: 'Invalid profile data.' };
  }

  const { id, institutionType, institutionName, area, ...data } = parsed.data;

  const updates: Record<string, any> = {
    'userProfile.name': data.name,
    'userProfile.gender': data.gender || null,
    'contact.phone': data.contactNumber || null,
    'contact.whatsapp': data.contactNumber || null, // Assuming phone and whatsapp are the same
    'institution.institutionType': institutionType || null,
    'institution.institutionName': institutionName || null,
    'location.area': area || null,
    'location.city': data.city || null,
    'location.pinCode': data.pinCode || null,
    'institution.hostelOrPG': null, // Explicitly remove this field
  };

  await updateUser(id, updates);

  revalidatePath('/profile');
  revalidatePath('/');
  return { message: 'Profile updated successfully!' };
}

export async function subscribeAction(plan: 'daily' | 'weekly' | 'monthly', userId: string) {
  let expiryDays = 0;
  if (plan === 'daily') expiryDays = 1;
  if (plan === 'weekly') expiryDays = 7;
  if (plan === 'monthly') expiryDays = 30;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  await updateUser(userId, {
    'subscription.status': 'active',
    'subscription.plan': plan,
    'subscription.expiry': expiryDate.toISOString(),
  });

  revalidatePath('/pricing');
  revalidatePath('/');
  revalidatePath('/profile');
}

const feedbackSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters.'),
});

export async function submitFeedbackAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = feedbackSchema.safeParse(data);

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      return { success: false, message: firstError || 'Invalid data.' };
    }

    const feedbackData = {
      email: parsed.data.email || null,
      feedback: parsed.data.feedback,
      createdAt: new Date(),
    };

    await db.collection('feedback').add(feedbackData);

    return { success: true, message: 'Thank you for your feedback!' };
  } catch (error) {
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
