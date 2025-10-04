
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Chat, Message, User } from '@/lib/types';
import { useAuth } from '@/providers';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageInput } from './message-input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Post, Utensils } from 'lucide-react';
import Link from 'next/link';

interface ChatWindowProps {
  chat: Chat;
  initialMessages: Message[];
  currentUser: User;
}

export function ChatWindow({ chat, initialMessages, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const otherUser = chat.users 
    ? chat.participants
        .map(id => chat.users[id])
        .find(u => u?.id !== currentUser.id)
    : null;

  const otherUserInitials = otherUser?.userProfile.name?.split(' ').map(n => n[0]).join('') || 'U';

  useEffect(() => {
    const messagesQuery = query(collection(db, `chats/${chat.id}/messages`), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toISOString(),
        } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chat.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  if (!otherUser) {
    return <div className="p-4">Could not load user data.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b">
         <Avatar>
            <AvatarImage src={otherUser.userProfile.photoURL ?? undefined} />
            <AvatarFallback>{otherUserInitials}</AvatarFallback>
          </Avatar>
        <h2 className="text-lg font-semibold">{otherUser.userProfile.name}</h2>
      </header>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth no-scrollbar">
        {messages.map((message, index) => {
          if (message.senderId === 'system') {
            return (
              <div key={message.id} className="text-center my-4">
                <div className="inline-block bg-muted text-muted-foreground text-xs rounded-full px-3 py-1">
                  {message.postId && message.postTitle ? (
                    <Link href={`/`} className="flex items-center gap-2 hover:underline">
                      <Utensils className="w-4 h-4" />
                      <span>{message.text}</span>
                    </Link>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            )
          }

          const isCurrentUser = message.senderId === currentUser.id;
          const messageDate = new Date(message.timestamp);

          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-sm md:max-w-md p-3 rounded-lg',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                    {format(messageDate, 'p')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t">
        <MessageInput chatId={chat.id} senderId={currentUser.id} />
      </div>
    </div>
  );
}
