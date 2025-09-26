import { CreatePostForm } from '@/components/create-post-form';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function CreatePostPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has an institution/location set
  if (!user.institution?.institutionName) {
    redirect('/profile?message=Please complete your location details first.');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatePostForm user={user} />
    </div>
  );
}
