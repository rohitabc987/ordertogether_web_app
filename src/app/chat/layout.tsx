
'use client';

import { useEffect, useState } from 'react';
import { getChatsForUserAction } from "@/lib/actions";
import { useAuth } from '@/providers';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from "@/components/chat-sidebar";
import type { Chat } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function ChatLayoutSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="flex h-[80vh] border-2 rounded-lg mt-4" style={{ borderColor: 'hsl(var(--chat-border))' }}>
        <div className="flex flex-col w-full md:w-80 lg:w-96 border-r-2" style={{ borderRightColor: 'hsl(var(--chat-border))' }}>
          <div className="p-4 border-b-2" style={{ borderBottomColor: 'hsl(var(--chat-border))' }}>
            <h2 className="text-xl font-semibold">Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-muted/30">
           <Skeleton className="h-24 w-24 rounded-full" />
           <Skeleton className="h-6 w-48 mt-4" />
           <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>
    </div>
  );
}


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isClientLoading, setIsClientLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    let isMounted = true;
    const cacheKey = `userChats_${user.id}`;

    const fetchChats = async () => {
      setIsClientLoading(true);
      // 1. Try to load from cache first
      try {
        const cachedChatsRaw = localStorage.getItem(cacheKey);
        if (cachedChatsRaw) {
          const cachedChats = JSON.parse(cachedChatsRaw);
          if (isMounted) {
            setChats(cachedChats);
          }
        }
      } catch (e) {
        console.warn("Could not load chats from cache", e);
      }

      // 2. Fetch definitive list from server
      const result = await getChatsForUserAction(user.id);

      if (!isMounted) return;

      if (result.success && result.chats) {
        setChats(result.chats);
        // 3. Update cache with the new list
        try {
          localStorage.setItem(cacheKey, JSON.stringify(result.chats));
        } catch (e) {
          console.warn("Could not save chats to cache", e);
        }
      } else {
        console.error("Failed to fetch chats:", result.message);
      }
      
      setIsClientLoading(false);
    };

    fetchChats();

    return () => {
      isMounted = false;
    };
  }, [user, router]);

  if (!user || isClientLoading) {
    return <ChatLayoutSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex h-[80vh] border-2 rounded-lg mt-4" style={{ borderColor: 'hsl(var(--chat-border))' }}>
        <ChatSidebar chats={chats} currentUser={user} />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
