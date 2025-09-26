import { AuthForm } from '@/components/auth-forms';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return <AuthForm />;
}
