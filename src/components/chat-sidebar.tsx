
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Chat, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatSidebarProps {
  chats: Chat[];
  currentUser: User;
}

export function ChatSidebar({ chats, currentUser }: ChatSidebarProps) {
  const pathname = usePathname();

  if (chats.length === 0) {
    return (
      <div className="w-full md:w-80 lg:w-96 border-r p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        <p className="text-muted-foreground">You have no active conversations.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-80 lg:w-96 border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {chats.map((chat) => {
            const otherUserId = chat.participants.find(id => id !== currentUser.id);
            if (!otherUserId || !chat.users?.[otherUserId]) return null;

            const otherUser = chat.users[otherUserId];
            const isActive = pathname === `/chat/${chat.id}`;

            const initials = (otherUser.userProfile.name || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('');
            
            const lastMessageText = chat.lastMessage?.senderId === currentUser.id 
                ? `You: ${chat.lastMessage.text}`
                : chat.lastMessage?.text;
            
            const timestampStr = chat.lastMessage?.timestamp;
            let timeAgo = '';
            if (timestampStr) {
                const date = new Date(timestampStr);
                if (!isNaN(date.getTime())) {
                    timeAgo = formatDistanceToNowStrict(date, { addSuffix: true });
                }
            }


            return (
              <li key={chat.id}>
                <Link
                  href={`/chat/${chat.id}`}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={otherUser.userProfile.photoURL ?? undefined} alt={otherUser.userProfile.name ?? ''} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold truncate">{otherUser.userProfile.name}</p>
                      {timeAgo && (
                         <time className="text-xs text-muted-foreground flex-shrink-0">
                           {timeAgo}
                         </time>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{lastMessageText}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
