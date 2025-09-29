

export interface User {
  id: string;
  updatedAt?: string; // For cache invalidation
  userProfile: {
    name: string;
    photoURL?: string | null;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  };
  contact: {
    email: string;
    phone?: string | null;
    whatsapp?: string | null;
  };
  institution: {
    institutionType?: 'College/University' | 'Hostel/PG/Apartment' | null;
    institutionName?: string | null;
  };
  location: {
    area?: string | null;
    city?: string | null;
    pinCode?: string | null;
  };
  subscription?: {
    status: 'active' | 'inactive';
    plan: 'single-post' | 'daily' | 'weekly' | 'monthly' | 'Premium' | null;
    startDate?: string | null;
    expiry?: string | null;
  };
}

export interface Post {
  id: string;
  title: string;
  authorId: string;
  restaurant: string;
  totalAmount: number;
  contributionAmount: number;
  deadline: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date; // To track if the post has been edited
  // Denormalized fields for querying and display
  institutionName?: string;
  area?: string;
  city?: string;
  authorName: string;
  authorGender: 'male' | 'female' | 'other';
  // Author details are joined from the users collection for contact info
  author: User;
}
