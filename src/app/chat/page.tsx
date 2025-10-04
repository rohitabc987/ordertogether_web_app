
import { MessageSquare } from 'lucide-react';
import { getChatsForUserAction } from '@/lib/actions';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const result = await getChatsForUserAction(user.id);
  const chats = result.success ? result.chats ?? [] : [];

  // If there are chats, redirect to the first one
  if (chats.length > 0) {
    redirect(`/chat/${chats[0].id}`);
  }

  // If there are no chats, show the placeholder
  return (
    <div className="flex h-full items-center justify-center bg-muted/30">
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Select a chat</h2>
        <p className="mt-1 text-muted-foreground">
          You have no active conversations yet.
        </p>
      </div>
    </div>
  );
}
