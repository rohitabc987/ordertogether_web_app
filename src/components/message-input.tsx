
'use client';

import { useState, useTransition, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { sendMessageAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  chatId: string;
  senderId: string;
}

export function MessageInput({ chatId, senderId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const optimisticText = text;
    setText(''); // Clear input immediately for better UX
    
    // Defer the focus call to run after the current execution context
    setTimeout(() => {
        inputRef.current?.focus();
    }, 0);

    startTransition(async () => {
      const result = await sendMessageAction(chatId, senderId, optimisticText);
      if (!result.success) {
        setText(optimisticText); // Restore text on failure
        toast({
          title: 'Error',
          description: result.message || 'Failed to send message.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
        autoComplete="off"
      />
      <Button type="submit" size="icon" disabled={isPending || !text.trim()}>
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
