
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (text === '') {
      // Re-focus when cleared
      inputRef.current?.focus();
    }
  }, [text]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const optimisticText = text;
    setText(''); // Clear input immediately

    startTransition(async () => {
      const result = await sendMessageAction(chatId, senderId, optimisticText);
      if (!result.success) {
        setText(optimisticText);
        toast({
          title: 'Error',
          description: result.message || 'Failed to send message.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
        autoFocus
        className="h-11 rounded-full px-4"
      />
      <Button type="submit" size="icon" disabled={isPending || !text.trim()} className="rounded-full w-11 h-11">
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
