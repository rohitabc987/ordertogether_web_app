'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/providers';
import { logoutAction } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UtensilsCrossed, LogOut, User, PlusCircle, DollarSign, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">OrderlyGather</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
          <Link href="/create-post" className="transition-colors hover:text-foreground/80 text-foreground/60">
            <PlusCircle className="inline-block -mt-1 mr-1 h-4 w-4" />
            Create Post
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
            <DollarSign className="inline-block -mt-1 mr-1 h-4 w-4" />
            Pricing
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="relative">
                   <Avatar className="h-7 w-7 mr-2">
                    {user.userProfile?.photoURL && <AvatarImage src={user.userProfile.photoURL} alt={user.userProfile.name || ''} />}
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user.userProfile?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-post">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create Post</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => startTransition(() => logoutAction())} disabled={isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isPending ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
