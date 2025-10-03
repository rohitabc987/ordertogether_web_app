'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export function EditingLockedDialog() {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && router.push('/my-posts')}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center p-6">
          <div className="p-3 bg-destructive/10 rounded-full mb-4">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-bold">Editing Locked</DialogTitle>
          <DialogDescription className="mt-2">
            This post has been edited once and cannot be changed again to ensure fairness for all participants.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-around p-6 bg-muted/50 rounded-b-lg gap-2">
          <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>
          <Button className="w-full" onClick={() => router.push('/my-posts')}>
            View My Posts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
