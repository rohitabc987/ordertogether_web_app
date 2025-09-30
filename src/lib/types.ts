
  export interface User {
    id: string;
    updatedAt?: string; // For cache invalidation
    userProfile: {
      name: string;
      photoURL?: string | null;
      gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
      lastProfileUpdate?: string;
    };
    contact: {
      email: string;
      phone?: string | null;
      whatsapp?: string | null;
      shareContact?: boolean; // New field
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
      postsViewed?: number;
    };
  }
