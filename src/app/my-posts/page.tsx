import { MyPostCard } from '@/components/my-post-card';
import { Button } from '@/components/ui/button';
import { getPostsByAuthorId } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import { PlusCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const posts = await getPostsByAuthorId(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">My Posts</h1>
        <Button asChild>
          <Link href="/create-post">
            <PlusCircle />
            Create New Post
          </Link>
        </Button>
      </div>

       {searchParams.message && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">Notification</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-500">
            {searchParams.message}
          </AlertDescription>
        </Alert>
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <MyPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
           <div className="flex justify-center mb-4">
            <img src="/images/empty-state.svg" alt="No Posts" className="w-48 h-48"/>
          </div>
          <h2 className="text-2xl font-headline text-primary">
            You haven't created any posts yet.
          </h2>
          <p className="text-muted-foreground mt-2">
          Want free delivery and great coupons? Create a group order today
          </p>
        </div>
      )}
    </div>
  );
}
