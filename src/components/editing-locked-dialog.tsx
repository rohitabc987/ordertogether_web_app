
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2, LayoutDashboard, ListOrdered } from 'lucide-react';

export function EditingLockedDialog() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={true} onOpenChange={() => router.push('/my-posts')}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Post Edited Successfully!</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              Your post has been updated. To maintain fairness, posts can only be edited once.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-around p-6 pt-0 gap-2">
            <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              <LayoutDashboard />
              Go to Dashboard
            </Button>
            <Button className="w-full" onClick={() => router.push('/my-posts')}>
                <ListOrdered />
                View My Posts
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
