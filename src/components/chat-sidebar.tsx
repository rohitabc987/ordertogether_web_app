
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Chat, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquarePlus } from 'lucide-react';

interface ChatSidebarProps {
  chats: Chat[];
  currentUser: User;
}

export function ChatSidebar({ chats, currentUser }: ChatSidebarProps) {
  const pathname = usePathname();

  if (chats.length === 0) {
    return (
      <div className="flex flex-col w-full md:w-80 lg:w-96 border-r-2 bg-background" style={{ borderRightColor: 'hsl(var(--chat-border))' }}>
        <div className="p-4 border-b-2" style={{ borderBottomColor: 'hsl(var(--chat-border))' }}>
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <MessageSquarePlus className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">No Conversations</h3>
            <p className="text-muted-foreground text-sm">
                You can start a chat from any active order post.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full md:w-80 lg:w-96 border-r-2 bg-background" style={{ borderRightColor: 'hsl(var(--chat-border))' }}>
      <div className="p-4 border-b-2" style={{ borderBottomColor: 'hsl(var(--chat-border))' }}>
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <nav className="flex-1 overflow-y-auto no-scrollbar">
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
                    'flex items-center gap-3 p-3 rounded-lg transition-colors group',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
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
                         <time className={cn("text-xs flex-shrink-0", isActive ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                           {timeAgo}
                         </time>
                      )}
                    </div>
                    <p className={cn("text-sm truncate", isActive ? 'text-primary-foreground/90' : 'text-muted-foreground' )}>{lastMessageText}</p>
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
