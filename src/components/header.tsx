
'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/providers';
import { logoutAction } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UtensilsCrossed, LogOut, User, PlusCircle, DollarSign, LogIn, Info, ListOrdered } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg text-white">OrderlyGather</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors text-white/80 hover:text-white">Dashboard</Link>
          <Link href="/about" className="transition-colors text-white/80 hover:text-white">
            <Info className="inline-block -mt-1 mr-1 h-4 w-4" />
            About
          </Link>
          <Link href="/create-post" className="transition-colors text-white/80 hover:text-white">
            <PlusCircle className="inline-block -mt-1 mr-1 h-4 w-4" />
            Create Post
          </Link>
          <Link href="/pricing" className="transition-colors text-white/80 hover:text-white">
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
                  <Link href="/my-posts">
                    <ListOrdered className="mr-2 h-4 w-4" />
                    <span>My Posts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-post">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create Post</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/about">
                    <Info className="mr-2 h-4 w-4" />
                    <span>About</span>
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
