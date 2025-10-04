
import { getChatsForUserAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { ChatSidebar } from "@/components/chat-sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const result = await getChatsForUserAction(user.id);
  const chats = result.success ? result.chats ?? [] : [];

  return (
    <div className="container mx-auto">
      <div className="flex h-[80vh] border-2 rounded-lg mt-4" style={{ borderColor: 'hsl(var(--chat-border))' }}>
        <ChatSidebar chats={chats} currentUser={user} />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
