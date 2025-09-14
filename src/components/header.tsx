'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/providers';
import { logoutAction } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UtensilsCrossed, LogOut, User, PlusCircle, DollarSign } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">OrderlyGather</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
           {user && (
            <>
              <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
              <Link href="/create-post" className="transition-colors hover:text-foreground/80 text-foreground/60">
                <PlusCircle className="inline-block -mt-1 mr-1 h-4 w-4" />
                Create Post
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                <DollarSign className="inline-block -mt-1 mr-1 h-4 w-4" />
                Pricing
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/profile">
                  <Avatar className="h-6 w-6 mr-2">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.name} />}
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
