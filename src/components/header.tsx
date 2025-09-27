'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAuth } from '@/providers';
import { logoutAction } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  UtensilsCrossed,
  LogOut,
  User,
  PlusCircle,
  DollarSign,
  LogIn,
  Info,
  ListOrdered,
  LayoutDashboard,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { auth as getAuthInstance } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    startTransition(async () => {
      const auth = getAuthInstance;
      if (auth) {
        await signOut(auth);
      }
      await logoutAction();
      router.push('/login');
      router.refresh();
    });
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/about', label: 'About', icon: Info },
    { href: '/create-post', label: 'Create Post', icon: PlusCircle },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-header-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg text-foreground">
            OrderlyGather
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground relative py-2',
                  isActive && 'text-foreground'
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="relative">
                  <Avatar className="h-7 w-7 mr-2">
                    {user.userProfile?.photoURL && (
                      <AvatarImage
                        src={user.userProfile.photoURL}
                        alt={user.userProfile.name || ''}
                      />
                    )}
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

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  disabled={isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isPending ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => {
                router.push('/login');
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
