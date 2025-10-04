
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat, Message, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, getDocs, startAfter, doc, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageInput } from './message-input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Utensils, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface ChatWindowProps {
  chat: Chat;
  initialMessages: Message[];
  currentUser: User;
}

const MESSAGES_PER_PAGE = 12;

export function ChatWindow({ chat, currentUser }: ChatWindowProps) {
  // ========= ALL HOOKS AT THE TOP (UNCONDITIONAL) =========
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const liveListenerUnsubscribe = useRef<(() => void) | null>(null);
  const chatScrolledToBottom = useRef(true);

  const chatCacheKey = `chat_${chat.id}`;

  const loadMoreMessages = useCallback(async () => {
    if (!firstVisible || isLoadingMore) return;

    setIsLoadingMore(true);
    const messagesQuery = query(
      collection(db, `chats/${chat.id}/messages`), 
      orderBy('timestamp', 'desc'),
      startAfter(firstVisible),
      limit(MESSAGES_PER_PAGE)
    );

    const documentSnapshots = await getDocs(messagesQuery);
    
    const newMessages: Message[] = documentSnapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString(),
    } as Message));

    const container = messagesContainerRef.current;
    const oldScrollHeight = container?.scrollHeight || 0;

    setMessages(prev => [...newMessages.reverse(), ...prev]);
    
    const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setFirstVisible(lastDoc);
    setHasMore(documentSnapshots.docs.length === MESSAGES_PER_PAGE);

    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - oldScrollHeight;
      });
    }

    setIsLoadingMore(false);
  }, [chat.id, firstVisible, isLoadingMore]);

  useEffect(() => {
    let isMounted = true;
    const initializeChat = async () => {
      setIsLoading(true);

      let localMessages: Message[] = [];
      try {
        const cached = localStorage.getItem(chatCacheKey);
        if (cached) {
          localMessages = JSON.parse(cached);
          if (isMounted) {
            setMessages(localMessages);
          }
        }
      } catch (e) {
        console.warn("Cache read error", e);
      }
      
      const lastLocalTimestamp = localMessages.length > 0 ? localMessages[localMessages.length - 1].timestamp : new Date(0).toISOString();
      const serverLastTimestamp = chat.lastMessage?.timestamp ?? new Date(0).toISOString();

      let finalMessages = localMessages;

      if (serverLastTimestamp > lastLocalTimestamp) {
        const deltaQuery = query(
          collection(db, `chats/${chat.id}/messages`),
          orderBy('timestamp', 'asc'),
          startAfter(Timestamp.fromDate(new Date(lastLocalTimestamp)))
        );
        const deltaSnapshot = await getDocs(deltaQuery);
        const newMessages = deltaSnapshot.docs.map(doc => ({
          id: doc.id, ...doc.data(), timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString(),
        } as Message));
        finalMessages = [...localMessages, ...newMessages];
      }

      if (localMessages.length === 0) {
        const initialQuery = query(collection(db, `chats/${chat.id}/messages`), orderBy('timestamp', 'desc'), limit(MESSAGES_PER_PAGE));
        const initialSnapshot = await getDocs(initialQuery);
        finalMessages = initialSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(), timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString()
        } as Message)).reverse();
        
        const lastDoc = initialSnapshot.docs[initialSnapshot.docs.length - 1];
        if (isMounted) {
            setFirstVisible(lastDoc || null);
            setHasMore(initialSnapshot.docs.length === MESSAGES_PER_PAGE);
        }
      }
      
      if (isMounted) {
        setMessages(finalMessages);
        setIsLoading(false);
      }

      try {
        localStorage.setItem(chatCacheKey, JSON.stringify(finalMessages));
      } catch (e) { console.warn("Cache write error", e); }

      const lastSyncedTimestamp = finalMessages.length > 0 ? new Date(finalMessages[finalMessages.length - 1].timestamp) : new Date(0);
      const liveQuery = query(
        collection(db, `chats/${chat.id}/messages`),
        orderBy('timestamp', 'asc'),
        startAfter(Timestamp.fromDate(lastSyncedTimestamp))
      );

      if (liveListenerUnsubscribe.current) {
        liveListenerUnsubscribe.current();
      }

      liveListenerUnsubscribe.current = onSnapshot(liveQuery, (snapshot) => {
        const newLiveMessages: Message[] = snapshot.docs.map(doc => ({
          id: doc.id, ...doc.data(), timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString()
        } as Message));

        if (newLiveMessages.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNewMessages = newLiveMessages.filter(m => !existingIds.has(m.id));
            if (uniqueNewMessages.length === 0) return prev;

            const updated = [...prev, ...uniqueNewMessages];
             try {
                localStorage.setItem(chatCacheKey, JSON.stringify(updated));
             } catch (e) { console.warn("Cache update error with live message", e); }
            return updated;
          });
        }
      });
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (liveListenerUnsubscribe.current) {
        liveListenerUnsubscribe.current();
      }
    };
  }, [chat.id, chat.lastMessage?.timestamp]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && chatScrolledToBottom.current) {
        container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  // ========= END OF HOOKS SECTION =========

  const otherUser = (chat.users && chat.participants)
    ? chat.participants
        .map(id => chat.users![id])
        .find(u => u?.id !== currentUser.id)
    : null;

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      chatScrolledToBottom.current = scrollHeight - scrollTop - clientHeight < 50;
      if (scrollTop === 0 && hasMore && !isLoadingMore) {
        loadMoreMessages();
      }
    }
  };
  
  if (isLoading && messages.length === 0) {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-muted/20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Chat...</p>
        </div>
    );
  }

  if (!otherUser) {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-muted/20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Initializing chat partner...</p>
        </div>
    );
  }
  
  const otherUserInitials = otherUser.userProfile.name?.split(' ').map(n => n[0]).join('') || 'U';

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
