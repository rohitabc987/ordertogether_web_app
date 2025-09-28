import { getPostById } from '@/lib/data';
import { redirect } from 'next/navigation';
import { EditPostForm } from '@/components/edit-post-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const post = await getPostById(params.id);

  if (!user) {
    redirect('/login');
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Post not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Ensure only the author can edit
  if (post.authorId !== user.id) {
      redirect('/my-posts');
  }

  // If post has been updated once, redirect them away
  if (post.updatedAt) {
    redirect('/my-posts?message=Post has already been updated.');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditPostForm post={post} />
    </div>
  );
}
