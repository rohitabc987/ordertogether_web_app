
import { EditPostForm } from '@/components/edit-post-form';
import { getPostById } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const post = await getPostById(params.id);

  if (!post) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Post not found.</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (post.authorId !== user.id) {
     return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You are not authorized to edit this post.</AlertDescription>
            </Alert>
        </div>
    );
  }

  // Check if the post has already been edited once
  const hasBeenEdited = !!post.timestamps.updatedAt && post.timestamps.createdAt !== post.timestamps.updatedAt;

  if (hasBeenEdited) {
     return (
        <div className="container mx-auto px-4 py-8">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Editing Locked</AlertTitle>
                <AlertDescription>This post has already been edited once and cannot be changed again.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditPostForm post={post} />
    </div>
  );
}
