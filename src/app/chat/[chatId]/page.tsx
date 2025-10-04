import { ChatWindow } from "@/components/chat-window";
import { getChatById } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import { AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const chat = await getChatById(chatId, user.id);
  
  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chat Not Found</AlertTitle>
          <AlertDescription>
            The chat you are looking for does not exist or you do not have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Pass an empty array for initial messages.
  // The ChatWindow component is optimized to handle this by loading from cache/server.
  const initialMessages = [];

  // Ensure we pass a serializable user object to the client component
  const serializableUser = JSON.parse(JSON.stringify(user));

  return (
    <ChatWindow chat={chat} initialMessages={initialMessages} currentUser={serializableUser} />
  );
}
