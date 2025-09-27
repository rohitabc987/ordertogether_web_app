import { Dashboard } from '@/components/dashboard';
import { getPostsForUser, getBannerImageUrl } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import type { Post } from '@/lib/types';

export default async function Home() {
  const user = await getCurrentUser();

  // Fetch all posts if no user is logged in, or user-specific posts if they are
  const initialPosts: Post[] = await getPostsForUser(user);
  const bannerImageUrl = await getBannerImageUrl();

  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard initialPosts={initialPosts} bannerImageUrl={bannerImageUrl} />
    </div>
  );
}
