
export interface User {
  id: string;
  updatedAt?: string; // For cache invalidation
  userProfile: {
    name: string;
    photoURL?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  };
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
  };
  institution: {
    institutionType?: 'College/University' | 'Hostel/PG/Apartment';
    institutionName?: string;
  };
  location: {
    area?: string;
    city?: string;
    pinCode?: string;
  };
  subscription?: {
    status: 'active' | 'inactive';
    plan: 'daily' | 'weekly' | 'monthly' | 'Premium';
    startDate?: string;
    expiry?: string;
  };
}

export interface Post {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorGender: 'male' | 'female' | 'other';
  restaurant: string;
  totalAmount: number;
  contributionAmount: number;
  deadline: Date;
  notes?: string;
  createdAt: Date;
  institution: {
    institutionType?: 'College/University' | 'Hostel/PG/Apartment';
    institutionName?: string;
  };
  location: {
    area?: string;
    city?: string;
    pinCode?: string;
  };
  contact: {
    phone?: string;
    whatsapp?: string;
  };
}
