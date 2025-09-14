export type SubscriptionStatus = 'active' | 'inactive';
export type SubscriptionPlan = 'daily' | 'weekly' | 'monthly' | null;

export interface Subscription {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  expiry: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string | null;
  password?: string;
  contact: {
    phone: string;
    whatsapp: string;
  };
  location: {
    hostel: string;
    society: string;
  };
  subscription: Subscription;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  contact: {
    phone: string;
    whatsapp: string;
  };
  location: {
    hostel: string;
    society: string;
  };
  restaurant: string;
  minAmount: number;
  maxAmount: number;
  deadline: string;
  notes?: string;
  createdAt: string;
}
