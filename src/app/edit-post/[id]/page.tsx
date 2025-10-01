
import { EditPostForm } from '@/components/edit-post-form';
import { EditingLockedDialog } from '@/components/editing-locked-dialog';
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

  // Check if the post has already been edited once.
  // We allow a 2-second difference to account for the time between creation and the timestamp being set.
  const { createdAt: createdAtString, updatedAt: updatedAtString } = post.timestamps;

  let hasBeenEdited = false;
  // The post is considered edited only if it has an updatedAt timestamp,
  // and that timestamp is more than 2 seconds after the createdAt timestamp.
  if (updatedAtString) {
    const createdAt = new Date(createdAtString).getTime();
    const updatedAt = new Date(updatedAtString).getTime();
    if (updatedAt - createdAt > 2000) {
      hasBeenEdited = true;
    }
  }

  if (hasBeenEdited) {
     return <EditingLockedDialog />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditPostForm post={post} />
    </div>
  );
}
