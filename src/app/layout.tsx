
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/providers';
import { Header } from '@/components/header';
import { getCurrentUser } from '@/lib/session';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/footer';
import { User } from '@/lib/types';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'OrderlyGather',
  description: 'Combine small orders, save on delivery fees.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  // Ensure user object is serializable
  const serializableUser = user ? JSON.parse(JSON.stringify(user)) as User : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable
        )}
      >
        <Providers initialUser={serializableUser}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
