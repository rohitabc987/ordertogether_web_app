
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat, Message, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, getDocs, startAfter, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageInput } from './message-input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Utensils, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface ChatWindowProps {
  chat: Chat;
  initialMessages: Message[]; // This will now be empty, but kept for prop consistency
  currentUser: User;
}

const MESSAGES_PER_PAGE = 15;

export function ChatWindow({ chat, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatScrolledToBottom = useRef(true);

  const otherUser = chat.users 
    ? chat.participants
        .map(id => chat.users[id])
        .find(u => u?.id !== currentUser.id)
    : null;

  const otherUserInitials = otherUser?.userProfile.name?.split(' ').map(n => n[0]).join('') || 'U';

  const fetchInitialMessages = useCallback(async () => {
    setIsLoading(true);
    const messagesQuery = query(
      collection(db, `chats/${chat.id}/messages`), 
      orderBy('timestamp', 'desc'), 
      limit(MESSAGES_PER_PAGE)
    );

    const documentSnapshots = await getDocs(messagesQuery);
    
    const newMessages: Message[] = [];
    documentSnapshots.forEach((doc) => {
      const data = doc.data();
      newMessages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString(),
      } as Message);
    });

    setMessages(newMessages.reverse());
    
    const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lastDoc);
    setHasMore(documentSnapshots.docs.length === MESSAGES_PER_PAGE);
    
    setIsLoading(false);
  }, [chat.id]);


  const loadMoreMessages = useCallback(async () => {
    if (!lastVisible || isLoadingMore) return;

    setIsLoadingMore(true);
    const messagesQuery = query(
      collection(db, `chats/${chat.id}/messages`), 
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(MESSAGES_PER_PAGE)
    );

    const documentSnapshots = await getDocs(messagesQuery);
    
    const newMessages: Message[] = [];
    documentSnapshots.forEach((doc) => {
      const data = doc.data();
      newMessages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString(),
      } as Message);
    });

    // Keep scroll position stable
    const container = messagesContainerRef.current;
    const oldScrollHeight = container?.scrollHeight || 0;

    setMessages(prev => [...newMessages.reverse(), ...prev]);
    
    const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastVisible(lastDoc);
    setHasMore(documentSnapshots.docs.length === MESSAGES_PER_PAGE);

    if (container) {
      // Restore scroll position after new messages are rendered
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - oldScrollHeight;
      });
    }

    setIsLoadingMore(false);
  }, [chat.id, lastVisible, isLoadingMore]);


  useEffect(() => {
    fetchInitialMessages();
  }, [fetchInitialMessages]);

  
  useEffect(() => {
    // Set up the real-time listener for new messages only
    if (messages.length === 0 && !isLoading) return; // Don't attach listener until initial load is done

    const lastTimestamp = messages.length > 0 ? new Date(messages[messages.length - 1].timestamp) : new Date(0);

    const q = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy('timestamp', 'asc'),
      startAfter(lastTimestamp)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check to prevent duplicates if listener fires too quickly
        if (new Date(data.timestamp.toDate().toISOString()) > lastTimestamp) {
            newMessages.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate().toISOString(),
          } as Message);
        }
      });
      
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      }
    });

    return () => unsubscribe();
  }, [chat.id, messages.length, isLoading]);


  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && chatScrolledToBottom.current) {
        container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      chatScrolledToBottom.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-muted/20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Chat...</p>
        </div>
    );
  }

  if (!otherUser) {
    return <div className="p-4">Could not load user data.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="flex items-center gap-4 p-3 border-b-2 bg-background/80 backdrop-blur-sm z-10" style={{ borderColor: 'hsl(var(--chat-border))' }}>
         <Avatar>
            <AvatarImage src={otherUser.userProfile.photoURL ?? undefined} />
            <AvatarFallback>{otherUserInitials}</AvatarFallback>
          </Avatar>
        <h2 className="text-lg font-semibold">{otherUser.userProfile.name}</h2>
      </header>

      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gradient-to-b from-background/10 to-muted/20">
        {hasMore && (
          <div className="text-center">
            <Button variant="link" onClick={loadMoreMessages} disabled={isLoadingMore}>
              {isLoadingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Load Older Messages
            </Button>
          </div>
        )}
        {messages.map((message) => {
          if (message.senderId === 'system') {
            return (
              <div key={message.id} className="text-center my-4">
                <div className="inline-block bg-muted text-muted-foreground text-xs rounded-full px-3 py-1 font-medium">
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
                  'max-w-md p-3 rounded-2xl shadow-sm',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-lg'
                    : 'bg-background rounded-bl-lg'
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
      
      <div className="p-4 border-t-2 bg-background/80 backdrop-blur-sm" style={{ borderColor: 'hsl(var(--chat-border))' }}>
        <MessageInput chatId={chat.id} senderId={currentUser.id} />
      </div>
    </div>
  );
}
