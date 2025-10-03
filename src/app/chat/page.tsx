
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex h-full items-center justify-center bg-muted/30">
      <div className="text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Select a chat</h2>
        <p className="mt-1 text-muted-foreground">
          Choose a conversation from the left to start messaging.
        </p>
      </div>
    </div>
  );
}
