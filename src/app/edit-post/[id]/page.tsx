import { EditPostForm } from '@/components/edit-post-form';
import { getPostById } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';
import { EditingLockedDialog } from '@/components/editing-locked-dialog';

function hasBeenEdited(createdAt: string, updatedAt?: string): boolean {
  if (!updatedAt) return false;
  const created = new Date(createdAt);
  const updated = new Date(updatedAt);
  // Consider edited if updated more than 2 seconds after creation
  return differenceInSeconds(updated, created) > 2;
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const post = await getPostById(params.id);

  if (!user) {
    redirect('/login');
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Post Not Found</AlertTitle>
          <AlertDescription>
            The post you are trying to edit does not exist or has been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (post.authorId !== user.id) {
    return (
       <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>
            You are not authorized to edit this post.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (hasBeenEdited(post.timestamps.createdAt, post.timestamps.updatedAt)) {
    return <EditingLockedDialog />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditPostForm post={post} />
    </div>
  );
}
