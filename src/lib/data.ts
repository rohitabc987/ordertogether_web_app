// @ts-nocheck
import type { User, Post, SubscriptionPlan, SubscriptionStatus } from './types';

// In-memory "database"
let users: User[] = [
  {
    id: 'user1',
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    photoURL: 'https://picsum.photos/seed/user1/200/200',
    password: 'password123',
    contact: { phone: '9876543210', whatsapp: '9876543210' },
    location: { hostel: 'Green View PG', society: 'Koramangala 1st Block' },
    subscription: {
      status: 'active',
      plan: 'monthly',
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: 'user2',
    name: 'Priya Singh',
    email: 'priya@example.com',
    photoURL: 'https://picsum.photos/seed/user2/200/200',
    password: 'password123',
    contact: { phone: '8765432109', whatsapp: '8765432109' },
    location: { hostel: 'Green View PG', society: 'Koramangala 1st Block' },
    subscription: { status: 'inactive', plan: null, expiry: null },
  },
  {
    id: 'user3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    photoURL: 'https://picsum.photos/seed/user3/200/200',
    password: 'password123',
    contact: { phone: '7654321098', whatsapp: '7654321098' },
    location: { hostel: 'Sunrise Hostel', society: 'Indiranagar' },
    subscription: { status: 'active', plan: 'weekly', expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
  },
];

let posts: Post[] = [
  {
    id: 'post1',
    authorId: 'user1',
    authorName: 'Rohan Sharma',
    contact: { phone: '9876543210', whatsapp: '9876543210' },
    location: { hostel: 'Green View PG', society: 'Koramangala 1st Block' },
    restaurant: 'Truffles',
    minAmount: 300,
    maxAmount: 500,
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    notes: 'Looking for someone to share a burger and shake order.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post2',
    authorId: 'user2',
    authorName: 'Priya Singh',
    contact: { phone: '8765432109', whatsapp: '8765432109' },
    location: { hostel: 'Green View PG', society: 'Koramangala 1st Block' },
    restaurant: 'Swiggy',
    minAmount: 150,
    maxAmount: 250,
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    notes: 'Just need to order some groceries. Anyone want to join?',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'post3',
    authorId: 'user3',
    authorName: 'Amit Patel',
    contact: { phone: '7654321098', whatsapp: '7654321098' },
    location: { hostel: 'Sunrise Hostel', society: 'Indiranagar' },
    restaurant: 'Leon Grill',
    minAmount: 200,
    maxAmount: 400,
    deadline: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    notes: 'Craving some peri peri chicken!',
    createdAt: new Date().toISOString(),
  },
];

// Mock API functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(user => user.email === email);
}

export async function getUserById(userId: string): Promise<User | undefined> {
  return users.find(user => user.id === userId);
}

export async function getPostsForUser(society: string): Promise<Post[]> {
  return posts
    .filter(post => post.location.society === society)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const newPost: Post = {
    ...postData,
    id: `post${posts.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  return newPost;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  users = users.map(user => {
    if (user.id === userId) {
      return { ...user, ...updates };
    }
    return user;
  });
  return users.find(user => user.id === userId);
}

export async function createUserInDb(data: { name: string; email: string; photoURL: string | null; password?: string }): Promise<User> {
  const newUser: User = {
    id: `user${users.length + 1}`,
    name: data.name,
    email: data.email,
    photoURL: data.photoURL,
    password: data.password || '', // In a real app, hash this
    contact: { phone: '', whatsapp: '' },
    location: { hostel: '', society: '' },
    subscription: { status: 'inactive', plan: null, expiry: null },
  };
  users.push(newUser);
  return newUser;
}
