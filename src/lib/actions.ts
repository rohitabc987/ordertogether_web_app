// @ts-nocheck
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { createPost, findUserByEmail, updateUser, createUserInDb } from '@/lib/data';
import { filterRestaurants } from '@/ai/flows/restaurant-filtering';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: 'Invalid email or password format.' };
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return { message: 'Invalid email or password.' };
  }

  cookies().set('session_userId', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  redirect('/');
}

export async function socialSignInAction(provider: 'google', user: { email: string | null; name: string | null; }) {
  if (!user.email || !user.name) {
    return { message: 'Google account must have an email and name.' };
  }
  
  if (!user.email.endsWith('@iitdh.ac.in')) {
    return { message: `Only users with a @iitdh.ac.in email can sign up. Your email is ${user.email}.` };
  }

  let dbUser = await findUserByEmail(user.email);

  if (!dbUser) {
    dbUser = await createUserInDb({
      name: user.name,
      email: user.email,
      password: '', // No password for social sign-in
    });
  }

  cookies().set('session_userId', dbUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  redirect('/');
}

export async function logoutAction() {
  cookies().delete('session_userId');
  redirect('/login');
}

const postSchema = z.object({
  restaurant: z.string().min(1, 'Restaurant is required.'),
  minAmount: z.coerce.number().min(0),
  maxAmount: z.coerce.number().min(0),
  deadline: z.coerce.date(),
  notes: z.string().optional(),
  authorId: z.string(),
  authorName: z.string(),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
  }),
  location: z.object({
    hostel: z.string(),
    society: z.string(),
  }),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const rawData = {
    ...Object.fromEntries(formData),
    contact: JSON.parse(formData.get('contact') as string),
    location: JSON.parse(formData.get('location') as string),
  };
  
  const parsed = postSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    return { message: 'Invalid post data. Please check your inputs.' };
  }
  
  if (parsed.data.minAmount > parsed.data.maxAmount) {
    return { message: 'Minimum amount cannot be greater than maximum amount.' };
  }

  await createPost(parsed.data);
  revalidatePath('/');
  redirect('/');
}

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  whatsapp: z.string().min(10, 'Please enter a valid WhatsApp number.'),
  hostel: z.string().min(1, 'Hostel/PG name is required.'),
  society: z.string().min(1, 'Society/Area name is required.'),
});

export async function updateProfileAction(prevState: any, formData: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: 'Invalid profile data.' };
  }

  await updateUser(parsed.data.id, {
    name: parsed.data.name,
    contact: { phone: parsed.data.phone, whatsapp: parsed.data.whatsapp },
    location: { hostel: parsed.data.hostel, society: parsed.data.society },
  });

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
    subscription: {
      status: 'active',
      plan: plan,
      expiry: expiryDate.toISOString(),
    },
  });

  revalidatePath('/pricing');
  revalidatePath('/');
  revalidatePath('/profile');
}

export async function getRestaurantSuggestions(location: string) {
  try {
    const result = await filterRestaurants({
      location,
      pastOrders: "Pizza, Burgers", // Mock data
      currentTrends: "Italian, Fast Food", // Mock data
    });
    return result.suggestedRestaurants;
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return [];
  }
}
