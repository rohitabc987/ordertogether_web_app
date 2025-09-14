import { Dashboard } from '@/components/dashboard';
import { getPostsForUser } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import type { Post } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // In a real app, you'd pass user location to getPostsForUser
  const initialPosts: Post[] = await getPostsForUser(user.location.society);

  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard initialPosts={initialPosts} />
    </div>
  );
}
